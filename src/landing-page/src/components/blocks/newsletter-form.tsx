"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function NewsletterForm() {
  return (
    <form className="flex flex-col gap-2">
      <Input
        type="email"
        placeholder="Enter your email"
        className="h-11 bg-background"
      />
      <Button
        size="lg"
        onClick={() => {
          alert("To do: Implement subscribe to newsletter");
        }}
      >
        Subcribe to Newsletter
      </Button>
    </form>
  );
}
