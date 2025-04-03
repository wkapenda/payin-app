import CenteredLayout from "@/components/layouts/CenteredLayout";

export default function Home() {
  return (
    <CenteredLayout>
      <h1 className="text-4xl font-bold mb-4">Welcome to the Payin App</h1>
      <p className="text-sm text-gray-700">
        Navigate to the localhost:3000/payin/(uuid) page to get started
      </p>
    </CenteredLayout>
  );
}
