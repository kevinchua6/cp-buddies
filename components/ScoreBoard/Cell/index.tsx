import { createStyles, rem, Text } from "@mantine/core";
import { DeleteModal, LeetCodeDetailsModal } from "../../Modals";
import { useDisclosure } from "@mantine/hooks";

const useStyles = createStyles(() => ({
  symbol: {
    fontSize: rem(30),
    fontWeight: 700,
    width: rem(60),
  },
}));

interface CellProps {
  children: React.ReactNode;
  key: string;
  symbol: string;
  handleDelete: () => void;
  cellOnClick: () => void;
}

export const Cell = ({
  children,
  key,
  symbol,
  handleDelete,
  cellOnClick,
}: CellProps) => {
  const { classes } = useStyles();

  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const deleteButtonOnClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    openDeleteModal();
  };

  return (
    <>
      <DeleteModal
        handleDelete={handleDelete}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
      />
      <div
        key={key}
        className="flex content-center rounded-lg border p-4 pl-6 bg-slate-100 hover:bg-slate-200 cursor-pointer"
        onClick={cellOnClick}
      >
        <Text className={classes.symbol}>{symbol}</Text>
        {children}
        <button
          className="p-2 text-gray-300 hover:text-gray-600 self-start ml-auto"
          onClick={deleteButtonOnClick}
        >
          ✕
        </button>
      </div>
    </>
  );
};
