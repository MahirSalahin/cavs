
import { Metadata } from 'next'
import CreatePollForm from './CreatePollForm';

export const metadata: Metadata = {
  title: "Create Contact",
};

export default function CreatePollPage() {


  return (
    <div className="container mt-8">
      <CreatePollForm />
    </div>
  )
}