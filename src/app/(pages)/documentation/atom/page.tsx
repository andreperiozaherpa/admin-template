"use client";

import { motion } from "framer-motion";
import { DokumentationButton } from "./documentationbutton";
import { DocumentationInput } from "./documentationinput";
import { DocumentationCheckbox } from "./documentationcheckbox";
import { DocumentationSwitch } from "./documentationswitch";
import { DocumentationTextArea } from "./documentationtextarea";
import { DocumentationBadge } from "./documentationbadge";
import { DocumentationRadio } from "./documentationradio";
import { DocumentationLoading } from "./documentationloading";
import { DocumentationProgress } from "./documentationprogress";
import { DocumentationSlider } from "./documentationslider";
import { DocumentationAvatar } from "./documentationavatar";
import { DocumentationTooltip } from "./documentationtooltip";
import { DocumentationSelect } from "./documentationselect";
import { DocumentationSkeleton } from "./documentationskeleton";
import { DocumentationAlert } from "./documentationalert";
import { DocumentationToast } from "./documentationtoast";
import { DocumentationModal } from "./documentationmodal";

export default function AtomDocs() {
    return (
        <div className="overflow-visible">
            {/* Header Dokumentasi */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 px-3"
            >
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 leading-tight uppercase italic">
                    Atoms <span className="text-[var(--theme-base)] not-italic font-light opacity-80">Level</span>
                </h1>
                <p className="text-sm md:text-base text-text-secondary font-light leading-relaxed max-w-2xl">
                    Unit terkecil dan murni dari sistem desain Tubaba. Komponen ini dirancang untuk fungsionalitas tunggal yang presisi dan taktil.
                </p>
            </motion.header>

            {/* Kontainer Komponen - Menggunakan ID untuk Anchor Link */}
            <div className="space-y-5 md:space-y-10">
                <section id="button" className="p-3"><DokumentationButton /></section>
                <section id="input" className="p-3"><DocumentationInput /></section>
                <section id="checkbox" className="p-3"><DocumentationCheckbox /></section>
                <section id="switch" className="p-3"><DocumentationSwitch /></section>
                <section id="textarea" className="p-3"><DocumentationTextArea /></section>
                <section id="badge" className="p-3"><DocumentationBadge /></section>
                <section id="radio" className="p-3"><DocumentationRadio /></section>
                <section id="loading" className="p-3"><DocumentationLoading /></section>
                <section id="progress" className="p-3"><DocumentationProgress /></section>
                <section id="slider" className="p-3"><DocumentationSlider /></section>
                <section id="avatar" className="p-3"><DocumentationAvatar /></section>
                <section id="tooltip" className="p-3"><DocumentationTooltip /></section>
                <section id="select" className="p-3"><DocumentationSelect /></section>
                <section id="skeleton" className="p-3"><DocumentationSkeleton /></section>
                <section id="alert" className="p-3"><DocumentationAlert /></section>
                <section id="toast" className="p-3"><DocumentationToast /></section>
                <section id="modal" className="p-3"><DocumentationModal /></section>
            </div>
        </div>
    );
}