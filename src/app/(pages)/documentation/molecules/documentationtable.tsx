"use client";

import React, { useState } from "react";
import {
    Table,
    TableRow,
    TableCell,
    TablePagination,
    TableEntries,
    Card,
    Badge,
    Button,
    Progress
} from "@/components/ui/Index";
import { Table as TableIcon, Code2, Info, MoveUpRight, Zap, FileEdit } from "lucide-react";
import { motion } from "framer-motion";

export const DocumentationTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const demoData = [
        { id: "PRO-001", name: "Alpha Protocol", status: "Active", progress: 85, color: "success" },
        { id: "PRO-002", name: "Beta Synchronization", status: "Pending", progress: 45, color: "warning" },
        { id: "PRO-003", name: "Gamma Encryption", status: "Secure", progress: 100, color: "info" },
        { id: "PRO-004", name: "Delta Overload", status: "Critical", progress: 15, color: "danger" },
    ];

    return (
        <section id="table" className="space-y-6">
            <div className="flex items-center gap-2 text-[var(--theme-base)] transition-colors">
                <TableIcon size={20} />
                <h2 className="text-xl font-black tracking-tight uppercase italic text-text-primary">
                    Data Grid System (Table)
                </h2>
            </div>

            <Card padding="lg" variant="standard">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                    {/* Sisi Kiri: Visual Showcase */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="flex items-center justify-between">
                            <Badge variant="soft">Interactive Grid</Badge>
                            <TableEntries value={itemsPerPage} onChange={setItemsPerPage} />
                        </div>

                        <Table
                            headers={["Node ID", "Protocol Name", "Status", "Load", "Action"]}
                            footer={
                                <TablePagination
                                    currentPage={currentPage}
                                    totalPages={3}
                                    onPageChange={setCurrentPage}
                                />
                            }
                        >
                            {demoData.map((item, i) => (
                                <TableRow key={item.id} index={i} statusColor={item.color as any}>
                                    <TableCell isFirst statusColor={item.color as any} className="font-black text-[10px] tracking-widest">
                                        {item.id}
                                    </TableCell>
                                    <TableCell className="font-bold text-text-primary italic uppercase">
                                        {item.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="soft" color={item.color as any} size="sm">
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="min-w-[140px]">
                                        <Progress value={item.progress} color={item.color as any} size="sm" />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="inset" className="!p-2 rounded-xl">
                                            <FileEdit size={14} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </div>

                    {/* Sisi Kanan: Usage Guide (Format Sesuai Permintaan) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-text-muted px-1">
                            <Code2 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Usage Guide</span>
                        </div>

                        <Card variant="inset" padding="md" className="relative group bg-surface-secondary/50 border-none overflow-hidden">
                            <pre className="text-[10px] font-medium leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto selection:bg-[var(--theme-base)]/30">
                                {`TABLE API (Tubaba 2026):
headers     : string[] (Judul Kolom)
footer      : ReactNode (Pagination)
statusColor : "primary" | "success" | 
              "warning" | "danger" | "info"
isFirst     : boolean (Glow Line Cell)

1. DATA GRID STRUCTURE
<Table 
  headers={["ID", "Name", "Action"]}
  footer={<TablePagination ... />}
>
  <TableRow statusColor="success">
    <TableCell isFirst>#01</TableCell>
    <TableCell>Protokol A</TableCell>
  </TableRow>
</Table>

2. PAGINATION CONTROL
<TablePagination 
  currentPage={page} 
  totalPages={10} 
  onPageChange={setPage} 
/>

3. ROW ENTRIES
<TableEntries 
  value={limit} 
  onChange={setLimit} 
/>`}
                            </pre>
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--theme-base)]/10 blur-[40px] rounded-full pointer-events-none" />
                        </Card>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2 text-text-muted">
                                <MoveUpRight size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Features</span>
                            </div>
                            <ul className="text-[10px] space-y-3 text-text-secondary leading-relaxed px-1">
                                <li className="flex gap-2">
                                    <Zap size={14} className="shrink-0 text-warning-base" />
                                    <span>**Tactile Interaction**: Setiap baris memiliki efek elevasi dan pendaran aksen sisi kiri saat diarahkan.</span>
                                </li>
                                <li className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-base mt-1.5 shrink-0" />
                                    <span>**Responsive Flow**: Wrapper tabel otomatis menangani scroll horizontal pada perangkat mobile.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </Card>
        </section>
    );
};