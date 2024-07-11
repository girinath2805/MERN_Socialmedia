import { useToast, UseToastOptions } from "@chakra-ui/react";

interface ShowToastOptions {
  title?: string;
  description?: string;
  status: UseToastOptions["status"];
}

const useShowToast = () => {
  const toast = useToast();

  const showToast = ({ title="", description="", status}: ShowToastOptions) => {
    toast({
      title,
      description,
      status,
      duration:2500,
      isClosable:true,
    });
  };

  return { showToast };
};

export default useShowToast;
