import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";
import { openNotification } from "@/utils/notification";
import { Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiKeyboardFill } from "react-icons/ri";
import { FiClipboard } from "react-icons/fi";
import { GrDocumentText, GrPowerReset } from "react-icons/gr";
import { RiFileCopy2Fill } from "react-icons/ri";
import Spinner from "@/utils/spinner";

const SummarizerView = () => {
  const [id, setId] = useState<number | null>(null);
  const [text, setText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [summarizedWordCount, setSummarizedWordCount] = useState<number>(0);
  const [summarizedCharCount, setSummarizedCharCount] = useState<number>(0);
  const [showButtons, setShowButtons] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const {
    forEdit,
    setForEdit,
    summaries,
    setSummaries,
    setTotalDoc,
    totalDoc,
  } = useSummaryStore();
  const { trigger, filter } = useViewStore();

  // Update word and character counts whenever text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedText = e.target.value;
    setText(updatedText);
    const words = updatedText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setCharCount(updatedText.length);
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((clipboardText) => {
      setText((prevText) => prevText + clipboardText);
      textareaRef.current?.focus();
      setShowButtons(false);
      const words = clipboardText.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
      setCharCount(clipboardText.length);
    });
  };

  const handleReset = () => {
    setText("");
    setSummary("");
    setShowButtons(true);
    setForEdit(null);
  };

  // Function to handle summarization
  const handleSummarize = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/summarizer", {
        content: text,
      });

      const data = response.data;

      if (response.status === 200) {
        setSummary(data.summary);
        setIsLoading(false);

        if (id) {
          const updateResponse = await axios.put(`/api/summary/${id}`, {
            content: text,
            summary: data.summary,
          });

          if (response.status !== 200) {
            throw new Error(
              `Failed to update summary: ${updateResponse.status} ${updateResponse.statusText}`
            );
          }
        } else {
          const addResponse = await axios.post("/api/summary", {
            content: text,
            summary: data.summary,
          });

          if (response.status === 200) {
            setForEdit(addResponse.data.id);
            setId(addResponse.data.id);
            setTotalDoc(totalDoc + 1);
          } else {
            throw new Error(
              `Failed to add summary: ${addResponse.status} ${addResponse.statusText}`
            );
          }
        }

        const getResponse = await axios.get("/api/summary", {
          params: { date: filter.date, search: filter.search },
        });

        if (getResponse.status === 200) {
          setSummaries({
            summaries: getResponse.data,
            total: getResponse.data.length,
          });
        }
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error during summarization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    openNotification("success", "Copied to Clipboard!");
    navigator.clipboard.writeText(summary);
  };

  useEffect(() => {
    if (forEdit) {
      // Find the summary with the matching ID
      const matchingSummary = summaries.find(
        (summary) => summary.id === forEdit
      );

      if (matchingSummary) {
        setText(matchingSummary.content);
        setSummary(matchingSummary.summary);
        setId(matchingSummary.id);
      }
    }
  }, []);

  // Handles the word and character count of content
  useEffect(() => {
    if (text) {
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
      setCharCount(text.length);
    }
  }, [text]);

  // Handles the word and character count of summary
  useEffect(() => {
    if (summary) {
      const words = summary.trim().split(/\s+/).filter(Boolean);
      setSummarizedWordCount(words.length);
      setSummarizedCharCount(summary.length);
    }
  }, [summary]);

  // Trigger when new Summarize Text button is clicked
  useEffect(() => {
    if (trigger) {
      setId(null);
      setText("");
      setSummary("");
      setShowButtons(true);
      setForEdit(null);
    }
  }, [trigger]);

  return (
    <div className="p-10 md:p-14 space-y-4">
      <div className="text-4xl font-bold">Text Summarizer</div>
      <div className="text-lg text-gray-500 font-caption">
        Summarize and manage texts with ease
      </div>
      {/* Input Content Section */}
      <div className="border border-[#14151A] bg-[#14151A] rounded-2xl py-2 md:py-4 space-y-4 relative">
        {/* Text Input */}
        <div className="relative">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="textarea-custom w-full h-32 p-2 border rounded-lg resize-none overflow-auto text-sm md:text-md"
            value={text}
            onChange={handleTextChange}
          ></textarea>

          {/* Icon Boxes */}
          {showButtons && text === "" && (
            <div className="absolute inset-0 flex justify-center items-center space-y-0 space-x-4 flex-row">
              {/* Enter Text Button */}
              <Button
                onClick={() => {
                  textareaRef.current?.focus(); // Focus on the textarea
                  setShowButtons(false); // Hide buttons after clicking
                }}
                color="default"
                variant="outlined"
                className="py-8"
              >
                <div className="flex flex-col items-center">
                  <RiKeyboardFill className="mb-1 text-gray-500 text-xl" />
                  <span>Enter Text</span>
                </div>
              </Button>

              {/* Paste Text Button */}
              <Button
                onClick={handlePaste}
                color="default"
                variant="outlined"
                className="py-8"
              >
                <div className="flex flex-col items-center">
                  <FiClipboard className="mb-1 text-gray-500 text-xl" />
                  <span>Paste Text</span>
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Word and Character Counts */}
        <div className="flex flex-col md:flex-row justify-between m-0 items-center text-sm text-gray-500 px-4">
          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div>
              Words: <span className="text-white">{wordCount}</span>
            </div>
            <div>
              Characters: <span className="text-white">{charCount}</span>
            </div>
          </div>

          {/*Buttons */}
          <div className="flex space-x-4 py-2 md:py-0">
            {text && (
              <Button
                onClick={handleReset}
                disabled={isLoading}
                ghost
                className="text-white black-disabled-btn"
              >
                <GrPowerReset />
                Reset
              </Button>
            )}
            <Button
              onClick={handleSummarize}
              color="default"
              variant="outlined"
              disabled={text.trim() === ""}
              className="black-disabled-btn"
            >
              Summarize My Text
              {isLoading && <Spinner />}
            </Button>
          </div>
        </div>
      </div>

      {/* Summarized Content Section */}
      <div className="border h-[20vh] min-h-[25vh] md:h-[40vh] border-[#DEE0E3] bg-[#eeeeee] rounded-2xl py-2 md:py-4 space-y-4">
        {summary ? (
          <div className="px-4 text-sm md:text-md">{summary}</div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl px-4 py-5 w-25 text-gray-500">
            <GrDocumentText className="text-6xl" />
            <span className="mt-2 p-4">
              Your summarized text will appear here
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-500 px-4">
        {/* Word and Character Counts */}
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div>
            Words: <span className="text-[#14151a]">{summarizedWordCount}</span>
          </div>
          <div>
            Characters:{" "}
            <span className="text-[#14151a]">{summarizedCharCount}</span>
          </div>
        </div>

        {/* Copy to Clipboard Button */}
        <div>
          <Button
            disabled={summary.trim() === ""}
            onClick={handleCopyToClipboard}
            className={`bg-[#eeeeee] p-2 mt-2 md:mt-0 rounded-lg flex items-center space-x-2 hover:bg-[#d8d8d8] ${
              summary.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <RiFileCopy2Fill />
            <span className="text-[#14151a]">Copy to Clipboard</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SummarizerView;
