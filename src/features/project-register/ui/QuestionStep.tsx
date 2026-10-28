import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CheckboxIcon,
  CloudUploadIcon,
  FileUploadIcon,
  RadioIcon,
  TextIcon,
  TextLineIcon,
} from '@umc-product/icons';
import {
  FormAttachmentField,
  FormChoiceListEditor,
  FormEditableQuestion,
  FormQuestion,
  FormQuestionEditor,
  FormQuestionToolbar,
  FormQuestionTypeList,
  FormSection,
  FormSectionEmpty,
  FormTextAnswer,
  SectionHeader,
} from '@umc-product/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { changeQuestionType, createQuestion } from '../model/draft';
import { LONG_ANSWER_MAX_LENGTH, SHORT_ANSWER_MAX_LENGTH } from '../model/limits';
import type {
  ProjectDraft,
  ProjectQuestion,
  QuestionSectionKey,
  QuestionType,
} from '../model/types';

const QUESTION_TYPE_ITEMS: { value: QuestionType; label: string; icon: ReactNode }[] = [
  { value: 'SHORT', label: '주관식', icon: <TextLineIcon /> },
  { value: 'LONG', label: '장문형', icon: <TextIcon /> },
  { value: 'SINGLE', label: '단일선택', icon: <RadioIcon /> },
  { value: 'MULTIPLE', label: '복수 선택', icon: <CheckboxIcon /> },
  { value: 'FILE', label: '파일업로드', icon: <CloudUploadIcon /> },
  { value: 'PORTFOLIO', label: '포트폴리오', icon: <FileUploadIcon /> },
];

const isQuestionType = (value: string): value is QuestionType =>
  QUESTION_TYPE_ITEMS.some((item) => item.value === value);

// 공통 문항 1 · 2번(이름/닉네임, 포트폴리오)은 고정이라 추가 문항은 3번부터 매김
const FIXED_COMMON_QUESTION_COUNT = 2;

const formatNumber = (index: number) => String(index).padStart(2, '0');

type QuestionEditorProps = {
  question: ProjectQuestion;
  number: string;
  active: boolean; // 포커스된 문항: 왼쪽 강조선 + 아래에 유형 선택
  onActiveChange: (active: boolean) => void;
  onChange: (question: ProjectQuestion) => void;
  onDelete: () => void;
};

// 문항 하나: 질문 · 설명 입력 + 유형별 답변 영역 + 필수 항목 · 삭제. 포커스되면 유형을 바꿀 수 있음
const QuestionEditor = ({
  question,
  number,
  active,
  onActiveChange,
  onChange,
  onDelete,
}: QuestionEditorProps) => {
  const { type, title, description, required, choices } = question;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  return (
    <div
      ref={setNodeRef}
      data-question-id={question.id}
      // 피그마: 편집 카드는 섹션 좌우 끝까지 차고, 강조선이 섹션 왼쪽 끝에 붙음 (섹션 안쪽 여백 20px을 덜어냄)
      className="-mx-5"
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onFocus={() => onActiveChange(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onActiveChange(false);
      }}
    >
      <FormQuestionEditor
        active={active}
        toolbar={
          <FormQuestionTypeList
            items={QUESTION_TYPE_ITEMS}
            value={type}
            onValueChange={(next) => {
              if (isQuestionType(next)) onChange(changeQuestionType(question, next));
            }}
          />
        }
        dragging={isDragging}
        dragHandleProps={{ ref: setActivatorNodeRef, ...attributes, ...listeners }}
        required={required}
        onRequiredChange={(next) => onChange({ ...question, required: next })}
        onDelete={onDelete}
      >
        <FormEditableQuestion
          number={number}
          required={required}
          titleProps={{
            value: title,
            placeholder: '질문을 작성하세요',
            onChange: (event) => onChange({ ...question, title: event.target.value }),
          }}
          descriptionProps={{
            value: description,
            placeholder: '설명을 적어주세요 (선택 사항)',
            onChange: (event) => onChange({ ...question, description: event.target.value }),
          }}
        >
          {(type === 'SHORT' || type === 'LONG') && (
            <FormTextAnswer
              className="form-answer-preview"
              disabled
              placeholder="작성하세요"
              maxLength={type === 'SHORT' ? SHORT_ANSWER_MAX_LENGTH : LONG_ANSWER_MAX_LENGTH}
            />
          )}
          {(type === 'SINGLE' || type === 'MULTIPLE') && (
            <FormChoiceListEditor
              type={type === 'SINGLE' ? 'single' : 'multiple'}
              options={choices}
              onOptionChange={(id, label) =>
                onChange({
                  ...question,
                  choices: choices.map((choice) =>
                    choice.id === id ? { ...choice, label } : choice,
                  ),
                })
              }
              onOptionAdd={() =>
                onChange({
                  ...question,
                  choices: [...choices, { id: crypto.randomUUID(), label: '' }],
                })
              }
              onOptionRemove={(id) =>
                onChange({ ...question, choices: choices.filter((choice) => choice.id !== id) })
              }
            />
          )}
          {(type === 'FILE' || type === 'PORTFOLIO') && <FormAttachmentField disabled />}
        </FormEditableQuestion>
      </FormQuestionEditor>
    </div>
  );
};

type QuestionListProps = {
  questions: ProjectQuestion[];
  startNumber: number;
  showEmpty?: boolean; // 문항이 없을 때 빈 안내를 보여줄지 (선택 섹션)
  onQuestionDeleted: (undo: () => void) => void; // 삭제 안내(토스트)는 화면에서 띄움
  onChange: (questions: ProjectQuestion[]) => void;
};

const QuestionList = ({
  questions,
  startNumber,
  showEmpty,
  onQuestionDeleted,
  onChange,
}: QuestionListProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const focusIdRef = useRef<string | null>(null);
  // 되돌리기는 토스트가 떠 있는 동안 눌리므로 그 시점의 최신 목록을 써야 함
  const latest = useRef({ questions, onChange });
  useEffect(() => {
    latest.current = { questions, onChange };
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // 새로 추가한 문항은 바로 질문을 쓸 수 있게 포커스
  useEffect(() => {
    const id = focusIdRef.current;
    if (!id) return;
    focusIdRef.current = null;
    document.querySelector<HTMLElement>(`[data-question-id="${id}"] input`)?.focus();
  }, [questions]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = questions.findIndex((item) => item.id === active.id);
    const to = questions.findIndex((item) => item.id === over.id);
    if (from < 0 || to < 0) return;
    onChange(arrayMove(questions, from, to));
  };

  const handleDelete = (question: ProjectQuestion, index: number) => {
    onChange(questions.filter((item) => item.id !== question.id));
    onQuestionDeleted(() => {
      const current = latest.current.questions;
      if (current.some((item) => item.id === question.id)) return;
      const next = [...current];
      next.splice(Math.min(index, next.length), 0, question);
      latest.current.onChange(next);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {showEmpty && questions.length === 0 && <FormSectionEmpty />}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={questions.map(({ id }) => id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question, index) => (
            <QuestionEditor
              key={question.id}
              question={question}
              number={formatNumber(startNumber + index)}
              active={activeId === question.id}
              onActiveChange={(active) =>
                setActiveId((current) =>
                  active ? question.id : current === question.id ? null : current,
                )
              }
              onChange={(next) =>
                onChange(questions.map((item) => (item.id === next.id ? next : item)))
              }
              onDelete={() => handleDelete(question, index)}
            />
          ))}
        </SortableContext>
      </DndContext>
      {/* 피그마: 문항을 편집 중일 때는 그 문항의 유형 선택만 보이고, 아니면 + 버튼 */}
      {activeId === null && (
        <FormQuestionToolbar
          items={QUESTION_TYPE_ITEMS}
          open={toolbarOpen}
          onOpenChange={setToolbarOpen}
          onTypeSelect={(value) => {
            if (!isQuestionType(value)) return;
            const created = createQuestion(value);
            onChange([...questions, created]);
            setToolbarOpen(false);
            setActiveId(created.id);
            focusIdRef.current = created.id;
          }}
        />
      )}
    </div>
  );
};

type QuestionStepProps = {
  draft: ProjectDraft;
  onChange: (patch: Partial<ProjectDraft>) => void;
  pePlatformLabel: string; // 2단계에서 고른 PE 플랫폼 (예: Web PE)
  onQuestionDeleted: (undo: () => void) => void;
};

// 3단계 지원 문항: 05 프로젝트 지원 문항 설정 (공통 문항 + Design · PE 선택 섹션)
const QuestionStep = ({
  draft,
  onChange,
  pePlatformLabel,
  onQuestionDeleted,
}: QuestionStepProps) => {
  const setQuestions = (key: QuestionSectionKey, questions: ProjectQuestion[]) =>
    onChange({ questions: { ...draft.questions, [key]: questions } });

  const setEnabled = (key: 'DESIGN' | 'PE', enabled: boolean) =>
    onChange({ sectionEnabled: { ...draft.sectionEnabled, [key]: enabled } });

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        number="05"
        title="프로젝트 지원 문항 설정"
        description="챌린저들이 프로젝트 지원 시 작성할 폼을 설정해주세요. 합격 결과를 전달할 수단도 포함 할 수 있어요."
      />
      <div className="flex flex-col gap-6">
        <FormSection title="공통 문항">
          <div className="flex flex-col gap-10 px-5 pt-8 pb-6">
            <FormQuestion number="01" title="지원자님의 이름/닉네임을 작성해주세요" required>
              <FormTextAnswer
                disabled
                placeholder="작성하세요"
                maxLength={SHORT_ANSWER_MAX_LENGTH}
              />
            </FormQuestion>
            <FormQuestion number="02" title="포트폴리오를 업로드해주세요" required>
              <FormAttachmentField disabled />
            </FormQuestion>
            <QuestionList
              onQuestionDeleted={onQuestionDeleted}
              questions={draft.questions.COMMON}
              startNumber={FIXED_COMMON_QUESTION_COUNT + 1}
              onChange={(questions) => setQuestions('COMMON', questions)}
            />
          </div>
        </FormSection>

        <FormSection
          variant="toggle"
          title="Design"
          optionalLabel="(선택 사항)"
          enabledLabel="섹션 사용"
          enabled={draft.sectionEnabled.DESIGN}
          onEnabledChange={(enabled) => setEnabled('DESIGN', enabled)}
        >
          <div className="px-5 pt-8 pb-6">
            <QuestionList
              onQuestionDeleted={onQuestionDeleted}
              questions={draft.questions.DESIGN}
              startNumber={1}
              onChange={(questions) => setQuestions('DESIGN', questions)}
            />
          </div>
        </FormSection>

        <FormSection
          variant="toggle"
          title={`${pePlatformLabel} Product Engineering`}
          optionalLabel="(선택 사항)"
          enabledLabel="섹션 사용"
          enabled={draft.sectionEnabled.PE}
          onEnabledChange={(enabled) => setEnabled('PE', enabled)}
        >
          <div className="px-5 pt-8 pb-6">
            <QuestionList
              onQuestionDeleted={onQuestionDeleted}
              questions={draft.questions.PE}
              startNumber={1}
              onChange={(questions) => setQuestions('PE', questions)}
            />
          </div>
        </FormSection>

        <ul className="flex flex-col text-caption-2-regular text-teal-grey-500">
          <li>* 지원자의 파트에 따라 해당하는 섹션의 질문만 노출돼요.</li>
          <li>* 개발(Web PE/Mobile PE) 섹션의 문항은 기획-개발자 매칭 전 다시 수정할 수 있어요.</li>
        </ul>
      </div>
    </div>
  );
};

export default QuestionStep;
