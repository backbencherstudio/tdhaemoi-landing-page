'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'

export default function DauerschleifePage() {
    const [openDialog, setOpenDialog] = useState(null);
    const handleZurueckConfirm = () => {
        setOpenDialog(null);
    };

    const handleBeendenConfirm = () => {
        setOpenDialog(null);
    };

    return (
        <div className='bg-black min-h-screen overflow-x-hidden'>
            {/* Logo */}
            <div className='flex justify-end px-5 md:px-10 xl:px-20 py-5 mt-5'>
                <Image src="/logo/logoBlue.png" alt="logo" width={100} height={100} className='w-24 h-auto' />
            </div>

            <div className='px-5 md:px-10 xl:px-20 py-5 mx-auto flex items-center min-h-[calc(100vh-200px)]'>
                <div className='flex flex-col lg:flex-row justify-between items-center w-full gap-10'>
                    {/* Left side - Text and Buttons */}
                    <div className='w-full lg:w-1/2 '>
                        <h1 className='text-white text-3xl lg:text-5xl font-bold mb-8 leading-tight'>
                            DEIN SCAN IST ABGESCHLOSSEN <br />
                            – WAS JETZT?
                        </h1>
                        <p className='text-white text-lg mb-12 leading-relaxed'>
                            Du bist fast fertig! Schließe den Prozess jetzt ab – dein Scan wird gespeichert und dir per E-Mail zugeschickt. Perfekt für die Nutzung in unserer App, um jederzeit individuelle Empfehlungen und Services zu erhalten.
                        </p>

                        {/* Buttons */}
                        <div className='space-y-4 flex flex-col gap-4'>
                            <Button
                                className='w-full cursor-pointer max-w-md py-6 px-6 border border-white bg-black text-white font-medium hover:bg-gray-900 transition-colors rounded'
                                variant=""
                                size="default"
                                onClick={() => setOpenDialog('zurueck')}
                            >
                                Zurück zur Kategorieauswahl
                            </Button>
                            <Button
                                className='w-full cursor-pointer rounded max-w-md py-6 px-6 bg-white text-black font-medium hover:bg-gray-100 transition-colors'
                                variant="default"
                                size="default"
                                onClick={() => setOpenDialog('beenden')}
                            >
                                Beenden & Scan per E-Mail erhalten
                            </Button>
                        </div>
                    </div>

                    {/* Right side - Phone Image */}
                    <div className='w-full lg:w-1/2 flex justify-center items-center mt-10 xl:mt-0 '>
                        <div className='relative w-fit'>
                            <div className='absolute inset-0 bg-black/50  rounded-lg z-10'></div>
                            <Image src="/phn.png" alt="phone" width={450} height={600} className='w-auto h-auto xl:max-w-2xl rounded-lg relative z-0' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog for Zurück zur Kategorieauswahl */}
            <Dialog open={openDialog === 'zurueck'} onOpenChange={(v) => setOpenDialog(v ? 'zurueck' : null)}>
                <DialogContent className="bg-white">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-lg font-semibold">
                            Willst du zur Kategorieauswahl zurückkehren und deinen aktuellen Scan für eine weitere Auswahl verwenden?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button onClick={handleZurueckConfirm} variant="default" size="default" className="w-full sm:w-auto cursor-pointer">
                            Ja, Scan übernehmen & zurück zur Auswahl
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" size="default" className="w-full sm:w-auto cursor-pointer"> Abbrechen</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog for Beenden & Scan per E-Mail erhalten */}
            <Dialog open={openDialog === 'beenden'} onOpenChange={(v) => setOpenDialog(v ? 'beenden' : null)}>
                <DialogContent className="bg-white">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-lg font-semibold">
                            Möchtest du den Scan abschließen und per E-Mail erhalten?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button onClick={handleBeendenConfirm} variant="default" size="default" className="w-full sm:w-auto cursor-pointer">
                            Scan beenden & E-Mail erhalten
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" size="default" className="w-full sm:w-auto cursor-pointer"> Abbrechen</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
