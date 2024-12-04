'use client'
import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

const languages = [
    { id: 'en', name: 'English', icon: '🇬🇧' },
    { id: 'es', name: 'Spanish', icon: '🇪🇸' },
    { id: 'de', name: 'German', icon: '🇩🇪' },
    { id: 'fr', name: 'French', icon: '🇫🇷' },
    { id: 'ja', name: 'Japanese', icon: '🇯🇵' },
    { id: 'ko', name: 'Korean', icon: '🇰🇷' },
    { id: 'zh', name: 'Chinese', icon: '🇨🇳' },
    { id: 'it', name: 'Italian', icon: '🇮🇹' },
    { id: 'ar', name: 'Arabic', icon: '🇸🇦' },
    { id: 'pl', name: 'Polish', icon: '🇵🇱' },
    { id: 'nl', name: 'Dutch', icon: '🇳🇱' },
    { id: 'hi', name: 'Hindi', icon: '🇮🇳' },
    { id: 'pt', name: 'Portuguese', icon: '🇵🇹' },
    { id: 'ru', name: 'Russian', icon: '🇷🇺' },
]

const JsonTranslator = () => {
    const [selectedLanguages, setSelectedLanguages] = useState<string>('')
    const [showAllLanguages, setShowAllLanguages] = useState(false)
    const [originalJson, setOriginalJson] = useState('{\n  // Please upload a JSON file\n}')
    const [translatedJson, setTranslatedJson] = useState('{\n  // Translation results will be displayed here\n}')
    const [isTranslating, setIsTranslating] = useState(false)

    const displayedLanguages = showAllLanguages ? languages : languages.slice(0, 12)

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type === "application/json") {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string
                    JSON.parse(content)
                    setOriginalJson(content)
                } catch (error) {
                    alert("Invalid JSON file")
                }
            }
            reader.readAsText(file)
        } else {
            alert("Please upload a JSON file")
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type === "application/json") {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string
                    JSON.parse(content)
                    setOriginalJson(content)
                } catch (error) {
                    alert("Invalid JSON file")
                }
            }
            reader.readAsText(file)
        }
    }

    const handleJsonInput = (value: string) => {
        setOriginalJson(value)
    }

    const handleTranslate = async () => {
        setIsTranslating(true)
        const jsonData = {
            language: selectedLanguages,
            originalJson: originalJson,
        }
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                body: JSON.stringify(jsonData),
            })
            const data = await response.json()
            setTranslatedJson(data.message)
        } catch (error) {
            console.error("Error translating JSON:", error)
        } finally {
            setIsTranslating(false)
        }
    }

    const handleCopyTranslation = () => {
        navigator.clipboard.writeText(translatedJson)
            .then(() => {
                alert("Copied to clipboard!")
            })
            .catch((err) => {
                console.error("Failed to copy:", err)
                alert("Failed to copy to clipboard")
            })
    }

    return (
        <div className="min-h-screen bg-blue-500 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center text-white space-y-4">
                    <h1 className="text-4xl font-bold">i18n JSON Translation Tool</h1>
                    <p className="text-xl">
                        Translate your JSON language files quickly using AI technology. Fast,
                        accurate, and easy to use.
                    </p>
                    <div className="flex justify-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <span>✨ Multilingual Support</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>⚡ Real-time Translation</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* File Upload Card */}
                        <Card className="bg-white">
                            <CardHeader>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Upload className="w-5 h-5" /> Upload JSON File
                                </h2>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
                                    onDrop={handleFileDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-600">
                                            Supports .json format files, up to 10MB
                                        </p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Drag files here or click to upload
                                        </p>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            accept=".json,application/json"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Language Selection */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Select Target Language</h2>
                                <p className="text-sm text-gray-500">
                                    Choose languages to translate into
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {displayedLanguages.map((lang) => (
                                        <Button
                                            key={lang.id}
                                            variant={selectedLanguages === lang.id ? "default" : "outline"}
                                            className="rounded-full"
                                            onClick={() => setSelectedLanguages(lang.id)}
                                        >
                                            {lang.icon} {lang.name}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="ghost"
                                    className="mt-4"
                                    onClick={() => setShowAllLanguages(!showAllLanguages)}
                                >
                                    {showAllLanguages ? "Show fewer languages" : "Show more languages"}
                                </Button>
                            </CardContent>
                        </Card>

                        <Button className="w-full" size="lg" onClick={handleTranslate} disabled={isTranslating}>
                            {isTranslating ? "Translating..." : "Start Translation"}
                        </Button>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Original JSON */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Original JSON</h2>
                                <p className="text-sm text-gray-500">
                                    Paste your JSON content directly or upload a file
                                </p>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={originalJson}
                                    onChange={(e) => handleJsonInput(e.target.value)}
                                    className="font-mono h-64 resize-none"
                                    placeholder="Paste your JSON here..."
                                />
                            </CardContent>
                        </Card>

                        {/* Translated JSON */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Translated JSON</h2>
                            </CardHeader>
                            <CardContent>
                                <pre 
                                    className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-auto h-64 [&_*]:decoration-transparent"
                                >
                                    {translatedJson}
                                </pre>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {selectedLanguages && (
                                        <Button variant="outline" size="sm">
                                            {languages.find((l) => l.id === selectedLanguages)?.name}
                                        </Button>
                                    )}
                                    <Button 
                                        variant="secondary" 
                                        size="sm"
                                        onClick={handleCopyTranslation}
                                    >
                                        Copy Translation
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JsonTranslator