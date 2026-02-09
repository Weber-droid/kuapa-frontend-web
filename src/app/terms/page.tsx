import React from "react";

export default function TermsPage() {
    return (
        <div className="page-content space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Terms of Service
            </h1>
            <div className="prose dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>
                    Please read these Terms of Service carefully before using the Kuapa app.
                </p>
                <h2>Acceptance of Terms</h2>
                <p>
                    By accessing or using our service, you agree to be bound by these Terms.
                    If you disagree with any part of the terms, then you may not access the
                    service.
                </p>
                <h2>Use of Service</h2>
                <p>
                    Kuapa provides AI-based crop disease detection. While we strive for
                    accuracy, the results are for informational purposes only and should not
                    replace professional agricultural advice.
                </p>
                <h2>User Accounts</h2>
                <p>
                    You are responsible for safeguarding the password that you use to access
                    the service and for any activities or actions under your password.
                </p>
            </div>
        </div>
    );
}
