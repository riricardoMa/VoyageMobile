// In your components
import { usePetApi } from "@services/network/hooks/usePetApi";

const MyComponent = () => {
  const { getPets, createPet, loading } = usePetApi();

  const handleCreatePet = async () => {
    try {
      const newPet = await createPet({
        name: "Fluffy",
        category: "cat",
        sex: "female",
        birthday: new Date().toISOString(),
      });
      console.log("Pet created:", newPet);
    } catch (error) {
      // Global error handler will show user-friendly message
      console.error("Failed to create pet:", error);
    }
  };
};
