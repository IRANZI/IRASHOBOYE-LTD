"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Language = "en" | "rw";

interface RegisterUserModalProps {
  codeId: string;
  code: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

const modalTranslations: Record<
  Language,
  {
    title: string;
    codeLabel: string;
    nameLabel: string;
    phoneLabel: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    cancel: string;
    register: string;
    registering: string;
    fillAllFields: string;
    success: string;
    failGeneric: string;
  }
> = {
  en: {
    title: "Register User for Code",
    codeLabel: "Code",
    nameLabel: "Name *",
    phoneLabel: "Phone Number *",
    namePlaceholder: "Enter name",
    phonePlaceholder: "+250788873038",
    cancel: "Cancel",
    register: "Register",
    registering: "Registering...",
    fillAllFields: "Please fill in all fields",
    success: "User registered successfully!",
    failGeneric: "Failed to register user",
  },
  rw: {
    title: "Andika Umukiriya ku Kode",
    codeLabel: "Kode",
    nameLabel: "Izina *",
    phoneLabel: "Numero ya Telefoni *",
    namePlaceholder: "Andika izina",
    phonePlaceholder: "+250788873038",
    cancel: "Funga",
    register: "Andika",
    registering: "Irimo kwandika...",
    fillAllFields: "Uzuza ibisabwa byose",
    success: "Umukiriya yanditswe neza!",
    failGeneric: "Kwiyandikisha byanze",
  },
};

export default function RegisterUserModal({
  codeId,
  code,
  isOpen,
  onClose,
  onSuccess,
  language,
}: RegisterUserModalProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = modalTranslations[language];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim()) {
      toast.error(t.fillAllFields);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/codes/${codeId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || t.failGeneric);
      }

      toast.success(t.success);
      setName("");
      setPhoneNumber("");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error registering user:", error);
      toast.error(error.message || t.failGeneric);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{t.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.codeLabel}
            </label>
            <div className="font-mono text-lg font-bold text-gray-900 bg-gray-50 p-3 rounded border">
              {code}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t.nameLabel}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t.namePlaceholder}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t.phoneLabel}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t.phonePlaceholder}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t.registering}</span>
                </>
              ) : (
                <span>{t.register}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


