"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Portfolio() {
  return (
    <div className="min-h-screen bg-black text-purple-300 flex justify-center">
      <div className="container max-w-3xl py-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-purple-500">
              <AvatarImage
                src="/static/images/profile_image.png"
                alt="Profile picture"
              />
              <AvatarFallback>TD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Thomas Mickley-Doyle
              </h1>
              <div className="flex gap-2 mt-2">
                <Link href="https://github.com/tmickleydoyle">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/20"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/thomas-mickley-doyle/">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/20"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="mailto:tmickleydoyle@gmail.com">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/20"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-6 bg-transparent border-transparent">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-400">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-300">
              New Orleans, Louisiana, USA - Remote
            </p>
          </CardContent>
        </Card>

        <section className="space-y-6">
          <Card className="bg-transparent border-transparent">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-300">
                  ML Engineering
                </h3>
                <p className="mt-2 text-purple-200">
                  Building fine-tuned language models to{" "}
                  <Link
                    href="https://tmickleydoyle-chat.vercel.app"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    enhance user experience
                  </Link>{" "}. Focused on
                  language models for SQL onboarding to empower co-workers
                  in data exploration. Creating
                  intelligent solutions that streamline learning processes and
                  improve data accessibility across teams with a variety of ML applications.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-300">
                  Data Platform Design
                </h3>
                <p className="mt-2 text-purple-200">
                  Designing intuitive data solutions that{" "}
                  <Link
                    href="https://github.com/tmickleydoyle/documents/blob/main/Prioritizing_Projects.md"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    drive product-led growth by working cross-collaboratively
                  </Link>{" "}
                  with product, engineering, and business teams. Focusing on{" "}
                  <Link
                    href="https://page-view-ab-stats.vercel.app"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    simplifying data processing, storage, and analytics adoption
                  </Link>{" "}
                  across teams. Creating seamless data platforms that enable
                  rapid product iteration and data-driven decision making.
                </p>
              </div>
              <Separator className="bg-purple-500/30" />
              <div>
                <h3 className="font-semibold text-purple-300">
                  Data Engineering
                </h3>
                <p className="mt-2 text-purple-200">
                  Architecting and implementing robust data systems, focusing on{" "}
                  <Link
                    href="https://github.com/tmickleydoyle/documents/blob/main/Fork_Sharing_Data_Across_Stores.md"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    scalability and performance
                  </Link>
                  . Developing data pipelines, analytics tools, and machine
                  learning models to drive product improvements and business
                  insights.
                </p>
              </div>
              <Separator className="bg-purple-500/30" />
              <div>
                <h3 className="font-semibold text-purple-300">
                  Data Science and Analytics
                </h3>
                <p className="mt-2 text-purple-200">
                  Appling advanced statistical methods and machine learning
                  techniques to solve complex business problems. Translating data
                  insights into actionable strategies,{" "}
                  <Link
                    href="https://github.com/tmickleydoyle/documents/blob/main/Monstera_Company_Metric_Design.md"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    enhancing product features and user experiences
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border-transparent">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">Life</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-300">
                  Community Gardener
                </h3>
                <p className="mt-2 text-purple-200">
                  Passionate about sustainable urban agriculture and mutual aid. Maintaining community gardens, organizing
                  volunteer programs, and sharing skills with local residents about
                  regenerative gardening practices. Contributing to food security
                  initiatives and environmental conservation efforts.
                </p>
              </div>
              <Separator className="bg-purple-500/30" />
              <div>
                <h3 className="font-semibold text-purple-300">Construction</h3>
                <p className="mt-2 text-purple-200">
                  My time in the Navy working construction sparked a lasting
                  passion for hands-on work. Today, I find immense joy in DIY
                  projects, home improvements, and helping friends with their
                  renovations. Working with my hands has become an essential
                  part of who I am.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
