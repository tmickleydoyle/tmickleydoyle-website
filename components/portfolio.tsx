'use client'

import { Github, Linkedin, Mail, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function Portfolio() {
  const { theme, setTheme } = useTheme()

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
                  Data Platform
                </h3>
                <p className="mt-2 text-purple-200">
                  Leading strategic initiatives in data management and
                  engineering. Specializing in developing scalable data
                  solutions and fostering cross-departmental collaboration to
                  drive data-driven decision making.
                </p>
              </div>
              <Separator className="bg-purple-500/30" />
              <div>
                <h3 className="font-semibold text-purple-300">
                  Open Source Contribution
                </h3>
                <p className="mt-2 text-purple-200">
                  Actively contributing to the open-source community through
                  code reviews, mentorship, and software quality evaluation.
                  Promoting innovation and best practices in software
                  development.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-purple-300">
                  Data Engineering
                </h3>
                <p className="mt-2 text-purple-200">
                  Architected and implemented robust data systems, focusing on
                  scalability and performance. Developed data pipelines,
                  analytics tools, and machine learning models to drive product
                  improvements and business insights.
                </p>
              </div>
              <Separator className="bg-purple-500/30" />
              <div>
                <h3 className="font-semibold text-purple-300">
                  Data Science and Analytics
                </h3>
                <p className="mt-2 text-purple-200">
                  Applied advanced statistical methods and machine learning
                  techniques to solve complex business problems. Translated data
                  insights into actionable strategies, enhancing product
                  features and user experiences.
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
                  Passionate about sustainable urban agriculture and community
                  engagement. Maintaining community gardens, organizing
                  volunteer programs, and educating local residents about
                  sustainable gardening practices. Contributing to food security
                  initiatives and environmental conservation efforts.
                </p>
              </div>
              <Separator className="bg-purple-500/30" />
              <div>
                <h3 className="font-semibold text-purple-300">Construction</h3>
                <p className="mt-2 text-purple-200">
                  Applied advanced statistical methods and machine learning
                  techniques to solve complex business problems. Translated data
                  insights into actionable strategies, enhancing product
                  features and user experiences.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}