"use client";

import { Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import profileImage from "@/static/images/profile_image.png";
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
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const scrollToTop = () => {
    // Scroll the window to top
    window.scrollTo({ top: 0, behavior: "instant" });
    // Also scroll the terminal container to top
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (messages.length) scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
    
    // Immediate scroll
    scrollToTop();
    
    // Backup scroll with multiple timeouts to ensure it works
    const timeouts = [
      setTimeout(() => scrollToTop(), 0),
      setTimeout(() => scrollToTop(), 10),
      setTimeout(() => scrollToTop(), 50),
      setTimeout(() => scrollToTop(), 100)
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
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
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            const content = data?.message?.content || "";
            if (content) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + content }
                    : m
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
          content: `Error: ${
            (error as Error)?.message || "Could not connect to Ollama service"
          }`,
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

        <div ref={terminalContainerRef} className="bg-[#0c0c0c] border-x border-b border-[#404040] rounded-b-lg p-3 sm:p-6 min-h-[400px] sm:min-h-[600px] overflow-x-auto max-h-[80vh] overflow-y-auto">
          {/* Whoami */}
          <div className="mb-6">
            <div className="text-[#7db46c] text-sm sm:text-base">
              thomas@portfolio:~$ whoami
            </div>
            <div className="text-[#7db46c] mb-4 mt-4 flex flex-col sm:flex-row gap-4 sm:items-center">
              <Image
                src={profileImage}
                alt="Thomas Mickley-Doyle"
                width={96}
                height={96}
                priority
                className="rounded-md border border-[#404040] grayscale-[30%] w-20 h-20 sm:w-24 sm:h-24 object-cover"
              />
              <div>
                <div>
                  <span className="text-[#d4af37]">NAME:</span> Thomas
                  Mickley-Doyle
                </div>
                <div className="mt-2">
                  <span className="text-[#d4af37]">ROLE:</span> Managing the
                  data team at StackBlitz
                </div>
                <div className="mt-2">
                  <span className="text-[#d4af37]">STATUS:</span> Online -
                  Available for opportunities
                </div>
              </div>
            </div>
            <div className="text-[#7db46c] mt-4 text-sm sm:text-base">
              thomas@portfolio:~$ cat README.md
            </div>
            <div className="text-[#7db46c] mt-2 leading-relaxed text-sm sm:text-base">
              Hi, I&apos;m Thomas. I took the long way into tech: Navy Seabee,
              then classroom teacher in New Orleans, then data scientist, and
              eventually building and leading data teams at GitHub, Vercel, and
              now StackBlitz. These days I spend my evenings training small
              language models and building tools for coding agents. When I&apos;m
              off the keyboard, I&apos;m usually in the garden or halfway
              through a home project.
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
                  [linkedin] → thomas-mickley-doyle
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
              Ithaca, New York, USA - working remotely
            </div>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <div className="text-[#7db46c] text-sm sm:text-base">
              thomas@portfolio:~$ cat life/journey.txt
            </div>
            <div className="mt-2 pl-2 sm:pl-4 border-l-2 border-[#404040] space-y-4 text-sm sm:text-base">
              <div>
                <div className="text-[#d4af37]">▶ Now: StackBlitz</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  I manage the data team at StackBlitz. My job is making sure
                  the people around me can get honest answers out of our data
                  without needing to be data experts themselves, and helping my
                  team do the best work of their careers.
                </div>
              </div>
              <div className="text-[#404040]">--------------------</div>
              <div>
                <div className="text-[#d4af37]">▶ GitHub &amp; Vercel</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  At GitHub I built metrics, forecasting, and alerting, and
                  spent a lot of time teaching folks SQL. At Vercel I got to
                  start the data team from scratch: the first architecture, the
                  first pipelines, the hiring process, and eventually systems
                  handling 100M+ events a day. Starting something from zero is
                  still my favorite kind of work.
                </div>
              </div>
              <div className="text-[#404040]">--------------------</div>
              <div>
                <div className="text-[#d4af37]">▶ Teaching in New Orleans</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  I taught for four years at Lagniappe Academies while earning
                  my M.S. in Predictive Analytics at Northwestern. Teaching
                  shaped how I lead: explain it plainly, meet people where they
                  are, and make sure they leave able to do it without you. From
                  there I moved into data science at Lucid.
                </div>
              </div>
              <div className="text-[#404040]">--------------------</div>
              <div>
                <div className="text-[#d4af37]">▶ US Navy Seabees</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  I started out in the Navy as a Seabee out of Gulfport,
                  Mississippi, working construction and managing projects. It
                  taught me to plan carefully, build things that hold up, and
                  look after the crew. I&apos;m a disabled veteran, and I still
                  carry those lessons into every team I&apos;m on.
                </div>
              </div>
            </div>
          </div>

          {/* Side projects */}
          <div className="mb-6">
            <div className="text-[#7db46c] text-sm sm:text-base">
              thomas@portfolio:~$ ls ~/tinkering/
            </div>
            <div className="text-[#7db46c] mt-2 leading-relaxed text-sm sm:text-base">
              What I&apos;ve been building lately, mostly late at night on
              my own hardware:
            </div>
            <div className="mt-2 space-y-1 text-sm sm:text-base">
              {[
                ["tiny-research", "95 five-minute training runs on one GPU; the winner is a 34M-param model that autocompletes in your browser"],
                ["agentic-coding-rl", "an RL environment for training agentic coding models, one rung at a time"],
                ["zidane-agent-flow", "watch a coding agent think, live, as a tree, timeline, and graph"],
                ["is-agent-running", "a little Swift app to tell me whether my agents are still working"],
                ["fill-in-the-middle", "fine-tuning Qwen3-8B for code completion"],
                ["shallow-explore", "quickly explore a CSV from the command line"],
                ["moonwalk", "walk the working directory up toward the root"],
              ].map(([name, desc]) => (
                <div key={name}>
                  <Link
                    href={`https://github.com/tmickleydoyle/${name}`}
                    className="text-[#87ceeb] hover:text-[#d4af37] transition-colors"
                  >
                    {name}/
                  </Link>
                  <span className="text-[#9aa0a6]"> - {desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <div className="text-[#7db46c] text-sm sm:text-base">
              thomas@portfolio:~$ cat life/interests.txt
            </div>
            <div className="mt-2 pl-2 sm:pl-4 border-l-2 border-[#404040] space-y-4 text-sm sm:text-base">
              <div>
                <div className="text-[#d4af37]">▶ Community Gardening</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  I care a lot about sustainable urban agriculture and mutual
                  aid. I help keep community gardens going, organize
                  volunteers, and swap what I know about regenerative gardening
                  with my neighbors. Growing food together is one of the best
                  ways I know to build a community.
                </div>
              </div>
              <div className="text-[#404040]">--------------------</div>
              <div>
                <div className="text-[#d4af37]">▶ Building Things</div>
                <div className="text-[#7db46c] mt-2 leading-relaxed">
                  The Seabees gave me a love of hands-on work that never left.
                  I&apos;m happiest with a DIY project going, fixing up the
                  house, or helping friends with their renovations. Working with
                  my hands is as much a part of me as writing code.
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
              placeholder="Ask me anything about my work or life..."
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
