import { LeetCodeDetailsModal } from "../../Modals";
import { useDisclosure } from "@mantine/hooks";
import { Cell } from ".";

interface LeetCodeCellProps {
  children: React.ReactNode;
  key: string;
  symbol: string;
  handleDelete: () => void;
  username: string;
}

export const LeetCodeCell = ({
  children,
  key,
  symbol,
  handleDelete,
  username,
}: LeetCodeCellProps) => {
  const [
    isLeetCodeModalOpen,
    { open: openLeetCodeModal, close: closeLeetCodeModal },
  ] = useDisclosure(false);

  return (
    <>
      <LeetCodeDetailsModal
        username={username}
        isOpen={isLeetCodeModalOpen}
        onClose={closeLeetCodeModal}
      />
      <Cell
        key={key}
        symbol={symbol}
        handleDelete={handleDelete}
        cellOnClick={openLeetCodeModal}
      >
        {children}
      </Cell>
    </>
  );
};
