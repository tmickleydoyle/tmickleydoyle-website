"use client";

import { Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function Portfolio() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (messages.length) scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: ChatMessage = {
      id: `${Date.now()}`,
      type: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    
    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.type === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

      const assistantId = (Date.now() + 1).toString();
      const placeholder: ChatMessage = {
        id: assistantId,
        type: "assistant",
        content: "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, placeholder]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/plain" },
        body: JSON.stringify({ message: currentInput, history }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = text || "Failed to get response";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: `Error: ${err}` } : m
          )
        );
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Error: Empty response stream" }
              : m
          )
        );
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        // Split chunk into lines and parse each JSON object
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            const content = data?.message?.content || '';
            if (content) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + content } : m
                )
              );
            }
          } catch {
            // Skip invalid JSON lines
            continue;
          }
        }
      }
    } catch (error: unknown) {
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          type: "assistant",
          content: `Error: ${(error as Error)?.message || 'Could not connect to Ollama service'}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#7db46c] font-mono p-2 sm:p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#2d2d2d] rounded-t-lg border border-[#404040] p-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[#ff5f56] rounded-full" />
            <div className="w-3 h-3 bg-[#ffbd2e] rounded-full" />
            <div className="w-3 h-3 bg-[#27c93f] rounded-full" />
          </div>
          <Terminal className="h-4 w-4 ml-2 text-[#8a8a8a]" />
          <span className="text-[#8a8a8a] text-sm hidden sm:inline">
            thomas@portfolio:~$
          </span>
        </div>

        <div className="bg-[#0c0c0c] border-x border-b border-[#404040] rounded-b-lg p-3 sm:p-6 min-h-[400px] sm:min-h-[600px] overflow-x-auto max-h-[80vh] overflow-y-auto">
          {/* Whoami */}
          <div className="mb-6">
            <div className="text-[#7db46c] text-sm sm:text-base">
              thomas@portfolio:~$ whoami
            </div>
            <div className="text-[#7db46c] mb-4">
              <div className="mt-4">
                <span className="text-[#d4af37]">NAME:</span> Thomas Mickley-Doyle
              </div>
              <div className="mt-2">
                <span className="text-[#d4af37]">STATUS:</span> Online -
                Available for opportunities
              </div>
            </div>
            <div className="text-[#7db46c] mt-4 text-sm sm:text-base">
              thomas@portfolio:~$ ls -la connections/
            </div>
            <div className="mt-2 space-y-1 text-sm sm:text-base">
              <div className="flex gap-4">
                <Link
                  href="https://github.com/tmickleydoyle"
                  className="text-[#87ceeb] hover:text-[#d4af37] transition-colors"
                >
                  [github] → tmickleydoyle
                </Link>
              </div>
              <div className="flex gap-4">
                <Link
                  href="https://www.linkedin.com/in/thomas-mickley-doyle/"
                  className="text-[#87ceeb] hover:text-[#d4af37] transition-colors"
                >
                  [linkedin] → thomas-doyle
                </Link>
              </div>
              <div className="flex gap-4">
                <Link
                  href="mailto:tmickleydoyle@gmail.com"
                  className="text-[#87ceeb] hover:text-[#d4af37] transition-colors"
                >
                  [email] → tmickleydoyle@gmail.com
                </Link>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="text-[#7db46c] text-sm sm:text-base">
              thomas@portfolio:~$ pwd
            </div>
            <div className="text-[#d4af37]">/home/thomas/location</div>
            <div className="text-[#7db46c] mt-1">
              Ithaca, New York, USA - Remote
            </div>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <div className="text-[#7db46c] text-sm sm:text-base">
              thomas@portfolio:~$ cat work/experience.txt
            </div>
            <div className="mt-2 pl-2 sm:pl-4 border-l-2 border-[#404040] space-y-4 text-sm sm:text-base">
              <div>
                <div className="text-[#d4af37]">▶ ML Engineering</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  Building fine-tuned language models to enhance user experience through patterned responses
                  without overwhelming them with text. Focused on fine-tuning
                  models for SQL onboarding to empower co-workers in data
                  exploration. Creating intelligent solutions
                  that streamline learning processes and improve data
                  accessibility across teams with a variety of ML applications.
                </div>
              </div>
              <div className="text-[#404040]">--------------------</div>
              <div>
                <div className="text-[#d4af37]">▶ Data Platform Design</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  Designing intuitive data solutions that drive product-led growth by working cross-collaboratively
                  with product, engineering, and business teams. Focusing on
                  simplifying data processing, storage, and analytics adoption
                  across teams. Creating seamless data platforms that enable
                  rapid product iteration and data-driven decision making.
                </div>
              </div>
              <div className="text-[#404040]">--------------------</div>
              <div>
                <div className="text-[#d4af37]">▶ Data Engineering</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  Architecting and implementing robust data systems, focusing on
                  scalability and performance. Developing data pipelines, analytics tools, and machine
                  learning models to drive product improvements and business
                  insights.
                </div>
              </div>
              <div className="text-[#404040]">--------------------</div>
              <div>
                <div className="text-[#d4af37]">
                  ▶ Data Science and Analytics
                </div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  Applying advanced statistical methods and machine learning
                  techniques to solve complex business problems. Translating
                  data insights into actionable strategies,
                  enhancing product features and user experiences.
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <div className="text-[#7db46c] text-sm sm:text-base">
              thomas@portfolio:~$ cat life/interests.txt
            </div>
            <div className="mt-2 pl-2 sm:pl-4 border-l-2 border-[#404040] space-y-4 text-sm sm:text-base">
              <div>
                <div className="text-[#d4af37]">▶ Community Gardener</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  Passionate about sustainable urban agriculture and mutual aid.
                  Maintaining community gardens, organizing volunteer programs,
                  and sharing skills with local residents about regenerative
                  gardening practices. Contributing to food security initiatives
                  and environmental conservation efforts.
                </div>
              </div>
              <div className="text-[#404040]">--------------------</div>
              <div>
                <div className="text-[#d4af37]">▶ Construction</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  My time in the Navy working construction sparked a lasting
                  passion for hands-on work. Today, I find immense joy in DIY
                  projects, home improvements, and helping friends with their
                  renovations. Working with my hands has become an essential
                  part of who I am.
                </div>
              </div>
            </div>
          </div>

          {/* Chat stream */}
          {messages.length > 0 && (
            <div className="mb-6 border-t border-[#404040] pt-4">
              {messages.map((message) => (
                <div key={message.id} className="mb-4">
                  {message.type === "user" ? (
                    <div className="text-sm sm:text-base leading-relaxed">
                      <span className="text-[#7db46c]">user@portfolio:~$ </span>
                      <span className="text-[#9aa0a6] whitespace-pre-wrap break-words">
                        {message.content}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[#7db46c] text-sm sm:text-base mb-1">
                        thomas@portfolio:~$
                      </div>
                      <div className="text-[#7db46c] whitespace-pre-wrap leading-relaxed text-sm sm:text-base pl-2 break-words">
                        {message.content && message.content.length > 0 ? (
                          message.content
                        ) : isLoading &&
                          messages[messages.length - 1]?.id === message.id ? (
                          <span className="animate-pulse">Thinking...</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Terminal prompt */}
          <div className="mt-8 flex items-center w-full min-w-0">
            <span className="text-[#7db46c] text-sm sm:text-base whitespace-nowrap mr-1">
              user@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Thomas's experience..."
              className="flex-1 bg-transparent text-[#9aa0a6] font-mono text-sm sm:text-base outline-none placeholder:text-[#5a5a5a] min-w-0 caret-[#7db46c]"
              disabled={isLoading}
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
