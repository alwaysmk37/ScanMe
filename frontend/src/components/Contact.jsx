import React from 'react';
import { Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl space-y-6">
      <h2 className="text-3xl font-extrabold text-slate-100 flex items-center justify-center gap-2 mb-2">
        <Mail className="text-blue-500" />
        Contact Security Core
      </h2>

      <div className="text-slate-300 space-y-6 text-sm text-center">
        <p className="max-w-md mx-auto text-slate-400">
          Have security feature requests, enterprise integration queries, or custom database configurations? Connect with our team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left font-mono">
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
            <Mail className="text-blue-400 mt-1" size={20} />
            <div>
              <span className="text-slate-500 text-xs uppercase block">Secure Email</span>
              <a href="mailto:support@scanmeapp.com" className="text-blue-400 hover:underline text-xs">support@scanmeapp.com</a>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
            <MapPin className="text-blue-400 mt-1" size={20} />
            <div>
              <span className="text-slate-500 text-xs uppercase block">Location Coordinates</span>
              <span className="text-slate-300 text-xs block">123 Security Lane</span>
              <span className="text-slate-400 text-[10px] block">Cyberville, ST 98765</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 max-w-xs mx-auto pt-4 leading-normal">
          Responses are processed securely within standard audit cycles (24-48 hours).
        </p>
      </div>
    </div>
  );
};

export default Contact;
