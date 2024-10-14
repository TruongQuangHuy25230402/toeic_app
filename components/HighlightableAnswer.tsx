import React, { useState } from 'react';

interface HighlightableTextProps {
  text: string;
}

const HighlightableText: React.FC<HighlightableTextProps> = ({ text }) => {
  const [highlights, setHighlights] = useState<{ start: number; end: number }[]>([]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0) {
      const selectedText = selection.toString();
      const range = selection.getRangeAt(0);
      
      if (selectedText) {
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        // Cập nhật danh sách highlight
        setHighlights((prev) => [
          ...prev,
          { start: range.startOffset, end: range.endOffset }
        ]);
      }
    }
  };

  // Hàm để tạo HTML cho văn bản với các phần highlight
  const createHighlightedHtml = () => {
    let highlightedText = text;
    
    // Thêm highlight cho từng đoạn đã lưu
    highlights.forEach(({ start, end }) => {
      highlightedText =
        highlightedText.slice(0, start) +
        `<span class="highlight" style="background-color: yellow;">${highlightedText.slice(start, end)}</span>` +
        highlightedText.slice(end);
    });

    return highlightedText;
  };

  return (
    <div 
      onMouseUp={handleMouseUp} 
      dangerouslySetInnerHTML={{ __html: createHighlightedHtml() }} 
      style={{ cursor: 'text', userSelect: 'text' }} // Đảm bảo có thể bôi đen
    />
  );
};

export default HighlightableText;
