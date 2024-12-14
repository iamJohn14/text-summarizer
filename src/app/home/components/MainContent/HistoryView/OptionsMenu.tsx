import { OptionsMenuProps } from "@/types/types";
import { Menu, Dropdown, Modal, Button } from "antd";
import { RiFileCopy2Fill, RiEdit2Fill, RiDeleteBin2Fill } from "react-icons/ri";
import { SlOptions } from "react-icons/sl";
import { openNotification } from "@/utils/notification";
import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";
import { useState } from "react";
import axios from "axios";
import Spinner from "@/utils/spinner";

const OptionsMenu: React.FC<OptionsMenuProps> = ({ summary }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setForEdit, setTotalDoc, totalDoc, setSummaries } = useSummaryStore();
  const { setSelectedView, filter, setCurrentPage, currentPage } =
    useViewStore();

  const onClick = async (e: { key: string }) => {
    if (e.key === "copy") {
      // Copy the summary.content to clipboard
      navigator.clipboard.writeText(summary.summary);
      openNotification("success", "Copied to Clipboard!");
    } else if (e.key === "edit") {
      setForEdit(summary.id);
      setSelectedView("home");
    } else if (e.key === "delete") {
      // Show the confirmation modal
      setModalVisible(true);
    }
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      // Call the delete API route
      const response = await axios.delete(`/api/summary/${summary.id}`);

      if (response.status === 200) {
        openNotification("success", "Summary deleted successfully!");
        setModalVisible(false);
        setForEdit(null);
        setTotalDoc(totalDoc - 1);

        const response = await axios.get("/api/summary", {
          params: { date: filter.date, search: filter.search },
        });

        if (response.status === 200) {
          const summaries = response.data;

          setSummaries({
            summaries,
            total: summaries.length,
          });

          const newTotalPages = Math.ceil(summaries.length / 5);
          const newCurrentPage =
            newTotalPages < currentPage ? currentPage - 1 : currentPage;
          setCurrentPage(newCurrentPage);
        }
      } else {
        console.error("Error deleting summary.");
        openNotification("error", "Error deleting summary.");
      }
    } catch (error) {
      console.error("An error occurred during the deletion:", error);
      openNotification("error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
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

      {/* Delete confirmation modal */}
      <Modal
        title="Delete summarized text?"
        open={isModalVisible}
        onCancel={handleCancelDelete}
        okButtonProps={{
          style: {
            backgroundColor: "#f44336", // Red color for delete button
            borderColor: "#f44336", // Red border for delete button
            color: "white", // White text
            width: "48%", // Adjust button width to spread them out
            height: "40px", // Adjust button height
          },
        }}
        cancelButtonProps={{
          style: {
            borderColor: "#ddd", // Light border for cancel button
            color: "#333", // Dark text color
            width: "48%", // Adjust button width to spread them out
            height: "40px", // Adjust button height
          },
        }}
        centered
        width={500} // Adjust modal width (optional, modify as needed)
        style={{ minWidth: "300px", maxWidth: "600px" }} // Control min/max width of the modal
        footer={
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Button
              onClick={handleCancelDelete}
              style={{
                borderColor: "#ddd",
                color: "#333",
                width: "48%",
                height: "40px",
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleConfirmDelete}
              style={{
                backgroundColor: "#f44336",
                borderColor: "#f44336",
                color: "white",
                width: "48%",
                height: "40px",
              }}
              disabled={isLoading}
            >
              Deleting
              {isLoading && <Spinner color="text-white" />}
            </Button>
          </div>
        }
      >
        <p className="text-gray-500">You will not be able to recover it.</p>
      </Modal>
    </div>
  );
};

export default OptionsMenu;
