// In your components
import { usePetApi } from "@services/network/hooks/usePetApi";

const MyComponent = () => {
  const { getPets, createPet, loading } = usePetApi();

  const handleCreatePet = async () => {
    try {
      const newPet = await createPet({
        name: "Fluffy",
        type: "CAT",
        sex: "GIRL",
        birthday: new Date().toISOString(),
        avatarFilePath: "example.jpg",
        ownerTitle: "Owner",
      });
      console.log("Pet created:", newPet);
    } catch (error) {
      // Global error handler will show user-friendly message
      console.error("Failed to create pet:", error);
    }
  };
};
