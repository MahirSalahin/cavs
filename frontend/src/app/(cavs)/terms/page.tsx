import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from 'next/link'

export default function Terms() {
  const lastUpdated = "29 October, 2024"

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By using CAVS, you agree to these Terms and Conditions, as well as our Privacy Policy. If you do not agree, please discontinue use of the system."
    },
    {
      title: "2. Description of Service",
      content: "CAVS provides an anonymous voting platform designed for students of CUET (Chittagong University of Engineering and Technology). Our platform allows users to participate in polls and surveys anonymously while respecting and protecting their privacy."
    },
    {
      title: "3. Eligibility",
      content: "To use CAVS, you must be a student of CUET with valid credentials to authenticate via our OAuth system. The information we access during authentication is limited to what is necessary to confirm eligibility and will not include any sensitive information beyond what is strictly required for authentication."
    },
    {
      title: "4. User Responsibilities",
      content: (
        <>
          You agree to use the CUET Anonymous Voting System (CAVS) in compliance with all applicable laws and regulations. You further agree not to:
          <ul className="list-disc ml-6">
            <li>Misrepresent your identity.</li>
            <li>Attempt to bypass the security mechanisms of CAVS.</li>
            <li>Submit any malicious code or engage in behavior that could harm the system or its users.</li>
            <li>Engage in any form of vote manipulation or fraud.</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Prohibited Activities",
      content: (
        <>
          Misuse of the CUET Anonymous Voting System (CAVS) is strictly prohibited, including but not limited to:
          <ul className="list-disc ml-6">
            <li>System abuse, such as spam polls.</li>
            <li>Creating offensive or inappropriate polls.</li>
            <li>Violating privacy or trying to tamper with system data.</li>
          </ul>
          <br/>
          <span className="text-red-400">Consequences: </span>Violations may lead to account suspension or a permanent ban.
        </>
      )
    }
    ,
    {
      title: "6. Privacy",
      content: (
        <>
          Your privacy is important to us. When you authenticate using OAuth, only limited information will be accessed to confirm your eligibility. No personally identifiable information (PII) will be stored or shared with third parties without your consent, except as required by law. For more details, please review our <Link href="/privacy" className='underline text-indigo-500'>Privacy Policy</Link>.
        </>
      )
    },
    {
      title: "7. Data Collection and Use",
      content: "CAVS will store your voting preferences in an anonymous and non-identifiable format to protect your privacy. Any data collected will be used solely for the purpose of providing and improving our services. We do not sell, trade, or share your data with third parties, except as described in our Privacy Policy."
    },
    {
      title: "8. Security",
      content: "We employ standard security measures to protect against unauthorized access, alteration, or destruction of data. However, no system is entirely secure, and we cannot guarantee absolute security of your data."
    },
    {
      title: "9. Limitation of Liability",
      content: "CAVS is provided on an \"as-is\" basis. CAVS and its developers make no warranties or representations regarding the availability, accuracy, or completeness of the service. You agree that CAVS and its developers shall not be held liable for any damages arising from your use of CAVS."
    },
    {
      title: "10. Changes to Terms",
      content: "We may update these Terms and Conditions from time to time. Any changes will be effective upon posting. Continued use of CAVS after changes have been posted constitutes acceptance of the revised Terms and Conditions."
    },
    {
      title: "11. Contact Information",
      content: (
        <>
          For any questions or concerns about these Terms and Conditions, please contact us at <a href='mailto:u2104083@student.cuet.ac.bd' className='underline text-indigo-500'>u2104083@student.cuet.ac.bd</a>.
        </>
      )
    }
  ]

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
          <CardDescription className="text-primary-foreground/80">Last Updated: {lastUpdated}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-6">
            Welcome to CAVS (CUET Anonymous Voting System). By accessing or using CAVS through our OAuth authentication process, you agree to comply with and be bound by the following terms and conditions.
          </p>
          {sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">{section.title}</h2>
              <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}