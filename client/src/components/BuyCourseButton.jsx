import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [
    createCheckoutSession,
    { data, isLoading, isSuccess, isError, error },
  ] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  useEffect(() => {
    if (isSuccess && data?.url) {
      window.location.href = data.url;
    } else if (isSuccess && !data?.url) {
      toast.error("Invalid response from server");
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.data?.message || "Failed to create checkout");
    }
  }, [isError, error]);

  return (
    <Button
      className="w-full"
      disabled={isLoading}
      onClick={purchaseCourseHandler}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait...
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
