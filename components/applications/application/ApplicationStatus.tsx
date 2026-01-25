import { Application } from "@/lib/slices/applicationsSlice"

export function formatApplicationStatus(status: Application["status"]) {
  switch (status) {
    case 'notApplied':
      return (
        <div className="bg-slate-100 dark:bg-transparent dark:border dark:border-slate-700 text-slate-800 dark:text-slate-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Not Applied</span>
        </div>
      )
    case 'submitted':
      return (
        <div className="bg-amber-100 dark:bg-transparent dark:border dark:border-amber-700 text-amber-800 dark:text-amber-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Submitted</span>
        </div>
      )
    case 'rejected':
      return (
        <div className="bg-red-100 dark:bg-transparent dark:border dark:border-red-700 text-red-800 dark:text-red-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Rejected</span>
        </div>
      )
    case 'offerExtendedInProgress':
      return (
        <div className="bg-emerald-100 dark:bg-transparent dark:border dark:border-emerald-700 text-emerald-800 dark:text-emerald-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Offer In Progress</span>
        </div>
      )
    case 'sentFollowUp':
      return (
        <div className="bg-purple-100 dark:bg-transparent dark:border dark:border-purple-700 text-purple-800 dark:text-purple-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Follow Up Sent</span>
        </div>
      )
    case 'ghosted':
      return (
        <div className="bg-zinc-100 dark:bg-transparent dark:border dark:border-zinc-700 text-zinc-800 dark:text-zinc-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Ghosted</span>
        </div>
      )
    case 'jobRemoved':
      return (
        <div className="bg-pink-100 dark:bg-transparent dark:border dark:border-pink-700 text-pink-800 dark:text-pink-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Job Removed</span>
        </div>
      )
    case 'offerExtendedNotAccepted':
      return (
        <div className="bg-orange-100 dark:bg-transparent dark:border dark:border-orange-700 text-orange-800 dark:text-orange-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Offer Not Accepted</span>
        </div>
      )
    case 'rescinded':
      return (
        <div className="bg-rose-100 dark:bg-transparent dark:border dark:border-rose-700 text-rose-800 dark:text-rose-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Rescinded</span>
        </div>
      )
    case 'notForMe':
      return (
        <div className="bg-indigo-100 dark:bg-transparent dark:border dark:border-indigo-700 text-indigo-800 dark:text-indigo-500 w-fit pl-2 pr-2.5 font-medium rounded-full">
          <span>Not For Me</span>
        </div>
      )
    default:
      return (
        <span className="text-muted-foreground">Unknown</span>
      )
  }
}