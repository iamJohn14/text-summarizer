import { useSummaryStore } from "@/stores/summaryStore";
import { useViewStore } from "@/stores/viewStore";
import { openNotification } from "@/utils/notification";
import Spinner from "@/utils/spinner";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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
        setTotalDoc(totalDoc + 1);
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
            className="textarea-custom w-full h-32 p-2 border rounded-lg resize-none overflow-auto"
            value={text}
            onChange={handleTextChange}
          ></textarea>

          {/* Icon Boxes */}
          {showButtons && text === "" && (
            <div className="absolute inset-0 flex justify-center items-center space-x-4">
              {/* Enter Text Button */}
              <button
                onClick={() => {
                  textareaRef.current?.focus(); // Focus on the textarea
                  setShowButtons(false); // Hide buttons after clicking
                }}
                className="flex flex-col items-center border border-[#DEE0E3] rounded-2xl px-4 py-5 w-32 bg-white hover:bg-gray-100"
              >
                <Image
                  src="/images/enter.png"
                  width={20}
                  height={20}
                  alt="enter"
                  priority
                />
                <span className="mt-1">Enter Text</span>
              </button>

              {/* Paste Text Button */}
              <button
                onClick={handlePaste}
                className="flex flex-col items-center border border-[#DEE0E3] rounded-2xl px-4 py-5 w-32 bg-white hover:bg-gray-100"
              >
                <Image
                  src="/images/paste.png"
                  width={20}
                  height={20}
                  alt="paste"
                  priority
                />
                <span className="mt-1">Paste Text</span>
              </button>
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
              <button
                onClick={handleReset}
                disabled={isLoading}
                className={`flex items-center p-2 rounded-lg font-caption ${
                  isLoading
                    ? "bg-[#2d2d2d] cursor-not-allowed border-[#2d2d2d]" // Muted disabled background color
                    : "bg-[#14151a] text-white border border-white hover:bg-gray-800"
                }`}
              >
                <Image
                  src="/images/reset.png"
                  width={20}
                  height={20}
                  alt="Reset"
                  className="mr-2"
                  priority
                />
                Reset
              </button>
            )}
            <button
              disabled={text.trim() === "" || isLoading}
              onClick={handleSummarize}
              className={`p-2 rounded-lg font-caption ${
                text.trim() === ""
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-[#d7d7d7] text-[#14151a]"
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Summarize My Text</span>{" "}
                  <Spinner size="text-lg" color="text-[#14151a]" />
                </>
              ) : (
                "Summarize My Text"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summarized Content Section */}
      <div className="border h-[20vh] min-h-[25vh] md:h-[40vh] border-[#DEE0E3] bg-[#eeeeee] rounded-2xl py-2 md:py-4 space-y-4">
        {summary ? (
          <div className="px-4">{summary}</div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl px-4 py-5 w-25 text-gray-500">
            <Image
              src="/images/summary.png"
              width={50}
              height={50}
              alt="summary"
              priority
            />
            <span className="mt-2 p-4">
              Your summarized text will appear here
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 px-4">
        {/* Word and Character Counts */}
        <div className="flex space-x-4">
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
          <button
            disabled={summary.trim() === ""}
            onClick={handleCopyToClipboard}
            className={`bg-[#eeeeee] p-2 rounded-lg flex items-center space-x-2 hover:bg-[#d8d8d8] ${
              summary.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {/* Icon with hover effect */}
            <Image
              src="/images/clipboard.png"
              width={45}
              height={45}
              alt="Clipboard Icon"
              className="w-5 h-5 hover:filter hover:brightness-110"
              priority
            />
            {/* Text */}
            <span className="text-[#14151a]">Copy to Clipboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummarizerView;
