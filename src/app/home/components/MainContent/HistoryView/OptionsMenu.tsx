import { OptionsMenuProps } from "@/types/types";
import { Menu, Dropdown } from "antd";
import { RiFileCopy2Fill, RiEdit2Fill, RiDeleteBin2Fill } from "react-icons/ri"; // Import icons for actions
import { SlOptions } from "react-icons/sl"; // Import icons for actions
import { openNotification } from "@/utils/notification";
import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";

const OptionsMenu: React.FC<OptionsMenuProps> = ({ summary }) => {
  const summaryStore = useSummaryStore();
  const viewStore = useViewStore();

  const onClick = (e: { key: string }) => {
    if (e.key === "copy") {
      // Copy the summary.content to clipboard
      navigator.clipboard.writeText(summary.summary);
      openNotification("success", "Copied to Clipboard!");
    } else if (e.key === "edit") {
      summaryStore.setForEdit(summary.id);
      viewStore.setSelectedView("home");
    } else if (e.key === "delete") {
      console.log(`Deleting summary: ${summary.id}`);
    }
  };

  return (
    <div>
      <Dropdown
        overlay={
          <Menu onClick={onClick}>
            <Menu.Item key="copy" icon={<RiFileCopy2Fill />}>
              Copy to Clipboard
            </Menu.Item>
            <Menu.Item key="edit" icon={<RiEdit2Fill />}>
              Edit
            </Menu.Item>
            <Menu.Item key="delete" icon={<RiDeleteBin2Fill />}>
              Delete
            </Menu.Item>
          </Menu>
        }
        trigger={["click"]}
      >
        <div className="border border-[#E9EAEC] rounded-2xl p-3 ml-2 text-gray-500 cursor-pointer">
          <a onClick={(e) => e.preventDefault()}>
            <SlOptions />
          </a>
        </div>
      </Dropdown>
    </div>
  );
};

export default OptionsMenu;
