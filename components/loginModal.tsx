"use client";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

interface LoginModalProps {
  open: boolean;
}

export default function LoginModal({ open }: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg w-full">
        <main className="w-full p-3 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg shadow-lg">
          <h1 className="text-white text-lg font-semibold">Login</h1>
        </main>
      </DialogContent>
    </Dialog>
  );
}