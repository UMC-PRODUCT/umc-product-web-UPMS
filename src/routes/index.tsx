import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <h1 className="p-8 text-3xl font-bold text-primary-500">UMC Product</h1>,
});
