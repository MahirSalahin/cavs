
import { Metadata } from 'next'
import CreatePollForm from './CreatePollForm';

export const metadata: Metadata = {
  title: "Create New Poll",
};

export default function CreatePollPage() {


  return (
    <div className="container mt-8">
      <CreatePollForm />
    </div>
  )
}