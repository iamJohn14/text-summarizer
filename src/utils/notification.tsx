import { notification } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

// Function to trigger the notification
export const openNotification = (
  status: "success" | "error",
  message: string,
  description?: string // Optional description parameter
) => {
  // Define different styles for each status
  const notificationStyles = {
    success: {
      backgroundColor: "#d4edda",
      borderColor: "#c3e6cb",
      color: "#155724",
    },
    error: {
      backgroundColor: "#f8d7da",
      borderColor: "#f5c6cb",
      color: "#721c24",
    },
  };

  // Set the style based on the status
  const style = notificationStyles[status];

  // Define the icon based on the status
  let icon;
  if (status === "success") {
    icon = <CheckCircleFilled style={{ color: "#3FBE61" }} />;
  } else if (status === "error") {
    icon = <CloseCircleFilled style={{ color: "#E6483D" }} />;
  }

  // Open the notification with custom styling and icon
  notification.open({
    message: <span style={{ fontSize: "16px" }}>{message}</span>, // Apply bold and larger font size to the title
    description, // Include the description if provided
    icon,
    placement: "top",
    style: {
      ...style,
      padding: "16px",
      borderRadius: "8px",
    },
  });
};
