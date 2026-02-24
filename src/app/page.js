import Button from "@/components/ui/Button";

export default function Home() {
return (
  <div className="flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="text-center mx-auto max-w-2xl space-y-s24">
      
      <div className="space-y-s8">
        <h1 className="
          heading-h2
          text-balance
          sm:heading-h2
        ">
          Welcome to Divyansh&apos;s CMS
        </h1>

        <p className="
          heading-h6
          text-secondary
          max-w-xs md:max-w-xl
          mx-auto
        ">
          Manage blogs, videos, and uploads from one place.
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          as="link"
          href="/dashboard"
        >
          Go to Dashboard
        </Button>
      </div>

    </div>
  </div>
);

}
