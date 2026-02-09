import React from "react";

export default function PrivacyPage() {
    return (
        <div className="page-content space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Privacy Policy
            </h1>
            <div className="prose dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>
                    At Kuapa, we take your privacy seriously. This Privacy Policy explains how
                    we collect, use, and protect your personal information.
                </p>
                <h2>Information We Collect</h2>
                <p>
                    We collect information you provide directly to us, such as when you
                    create an account, update your profile, or use our services. This may
                    include your name, email address, phone number, and farm details.
                </p>
                <h2>How We Use Your Information</h2>
                <p>
                    We use the information we collect to provide, maintain, and improve our
                    services, such as to personalize your experience and send you technical
                    notices and support messages.
                </p>
                <h2>Image Data</h2>
                <p>
                    Images you upload for disease detection are processed to provide you with
                    results. We may use anonymized image data to improve our detection
                    models.
                </p>
            </div>
        </div>
    );
}
