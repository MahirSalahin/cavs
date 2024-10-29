import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PrivacyPolicy() {
  const lastUpdated = "29 October, 2024"

  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          CAVS is designed to ensure that your privacy as a voter is fully protected. During your use of the system, we may collect the following information:
          <ul className="list-disc ml-6">
            <li>
              <strong>Poll Creator&apos;s Information:</strong> The email or student ID of the poll creator will be visible to all users participating in the poll. This allows users to know who created the poll, providing transparency.
            </li>
            <li>
              <strong>Voter&apos;s Information:</strong> No personally identifiable information (PII) of voters is stored, shared, or made visible to poll creators or other users.
            </li>
          </ul>
        </>
      )
    },
    {
      title: "2. Voter Anonymity",
      content: "Your voting choices are completely anonymous. Our system is built to ensure that no one – including poll creators, administrators, or other users – can identify individual voting preferences. The only visible identifier in the poll is the poll creator; no voter's email, identity, or choice is accessible or stored in a way that can be traced back to you."
    },
    {
      title: "3. Use of Information",
      content: (
        <>
          <ul className="list-disc ml-6">
            <li>
              <strong>Poll Creation:</strong> The email or student ID of the poll creator is collected to validate and allow poll setup, as well as to enable other users to view who created a poll.
            </li>
            <li>
              <strong>Service Improvement:</strong> We may use aggregated and non-identifiable data to enhance and improve the CAVS platform.
            </li>
            <li>
              <strong>System Security:</strong> We may monitor usage patterns and system logs to protect CAVS against unauthorized access or potential abuse. However, this monitoring does not impact voter anonymity or expose individual choices.
            </li>
          </ul>
        </>
      )
    },
    {
      title: "4. How We Protect Your Information",
      content: "CAVS implements industry-standard security protocols to prevent unauthorized access to your data. Our commitment to privacy is uncompromising, especially concerning voter choices, which are securely encrypted and anonymized. However, please be aware that no system is entirely infallible, and while we make every effort to protect your data, absolute security cannot be guaranteed."
    },
    {
      title: "5. Sharing of Information",
      content: (
        <>
          <ul className="list-disc ml-6">
            <li>
              <strong>Third-Party Sharing:</strong> We do not sell, trade, or otherwise transfer to outside parties any personally identifiable information. The email or student ID of poll creators is not shared beyond the intended function within the CAVS platform.
            </li>
            <li>
              <strong>Legal Requirements:</strong> In the rare event that disclosure of poll data is required by law, we will only disclose information as legally mandated, while continuing to protect voter anonymity to the greatest extent possible.
            </li>
          </ul>
        </>
      )
    },
    {
      title: "6. Data Retention",
      content: "We retain poll data only as long as necessary to fulfill the purpose of your use of CAVS or as required by law. Poll data, including votes, may be aggregated and anonymized for future analysis and service improvement but will not include any personal identifiers."
    },
    {
      title: "7. Changes to This Privacy Policy",
      content: "We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal obligations. Any modifications will be effective upon posting on this page. We encourage you to review this Privacy Policy periodically."
    },
    {
      title: "8. Contact Us",
      content: (
        <>
          For any questions or concerns about these Privacy Policy, please contact us at <a href='mailto:u2104083@student.cuet.ac.bd' className='underline text-indigo-500'>u2104083@student.cuet.ac.bd</a>.
        </>
      )
    }
  ]

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          <CardDescription className="text-primary-foreground/80">Last Updated: {lastUpdated}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-6">
            CUET Anonymous Voting System (CAVS) is committed to protect your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you access and use CAVS. By using CAVS, you agree to the practices described in this policy.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {sections.map((section, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left font-semibold text-foreground">{section.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}