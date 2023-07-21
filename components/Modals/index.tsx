import { Modal, Stack, Button, Text, Image } from "@mantine/core";
import { LoadingSpinner } from "../Spinner";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeleteModalProps extends ModalProps {
  handleDelete: () => void;
}

interface LeetCodeDetailsModalProps extends ModalProps {
  username: string;
}

export const DeleteModal = ({
  handleDelete,
  isOpen,
  onClose,
}: DeleteModalProps) => {
  return (
    <Modal opened={isOpen} onClose={onClose}>
      <Stack className="text-center">
        <Text fw={500}>Are you sure you want to delete this friend?</Text>
        <div className="flex flex-row justify-between p-4">
          <Button
            variant="filled"
            onClick={handleDelete}
            color="red"
            className="bg-red-500"
          >
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Stack>
    </Modal>
  );
};

const ImageWithPlaceholder = ({
  src,
  onClick,
}: {
  src: string;
  onClick?: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className={"relative" + onClick ? "cursor-pointer" : ""}>
      {!isLoaded && <LoadingSpinner />}
      <Image
        onClick={onClick}
        onLoad={() => setIsLoaded(true)}
        src={src}
        alt="LeetCode Stats"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
};

export const LeetCodeDetailsModal = ({
  isOpen,
  onClose,
  username,
}: LeetCodeDetailsModalProps) => {
  return (
    <Modal className="z-10" opened={isOpen} onClose={onClose} padding="xs">
      <Stack className="text-center" spacing="xs">
        <Text size="lg">Details</Text>
        <ImageWithPlaceholder
          onClick={() =>
            window.open(
              `https://leetcode.com/${username}`,
              "_blank",
              "noreferrer noopener"
            )
          }
          src={`https://leetcard.jacoblin.cool/${username}?theme=unicorn&font=Georama&ext=activity`}
        />
      </Stack>
    </Modal>
  );
};
