"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Star, StarOff, History, Languages, Menu, Loader2, RefreshCw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Translation {
  id: string
  sourceText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  timestamp: number
}

interface Language {
  code: string
  name: string
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "cs", name: "Czech" },
  { code: "sk", name: "Slovak" },
  { code: "hu", name: "Hungarian" },
  { code: "ro", name: "Romanian" },
  { code: "bg", name: "Bulgarian" },
  { code: "hr", name: "Croatian" },
  { code: "sr", name: "Serbian" },
  { code: "sl", name: "Slovenian" },
  { code: "et", name: "Estonian" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "uk", name: "Ukrainian" },
  { code: "be", name: "Belarusian" },
  { code: "ka", name: "Georgian" },
  { code: "am", name: "Amharic" },
  { code: "sw", name: "Swahili" },
  { code: "zu", name: "Zulu" },
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian" },
  { code: "az", name: "Azerbaijani" },
  { code: "eu", name: "Basque" },
  { code: "bn", name: "Bengali" },
  { code: "bs", name: "Bosnian" },
  { code: "ca", name: "Catalan" },
  { code: "ceb", name: "Cebuano" },
  { code: "ny", name: "Chichewa" },
  { code: "co", name: "Corsican" },
  { code: "eo", name: "Esperanto" },
  { code: "tl", name: "Filipino" },
  { code: "fy", name: "Frisian" },
  { code: "gl", name: "Galician" },
  { code: "gu", name: "Gujarati" },
  { code: "ht", name: "Haitian Creole" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "Hawaiian" },
  { code: "hmn", name: "Hmong" },
  { code: "is", name: "Icelandic" },
  { code: "ig", name: "Igbo" },
  { code: "id", name: "Indonesian" },
  { code: "ga", name: "Irish" },
  { code: "jw", name: "Javanese" },
  { code: "kn", name: "Kannada" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Khmer" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "ku", name: "Kurdish" },
  { code: "ky", name: "Kyrgyz" },
  { code: "lo", name: "Lao" },
  { code: "la", name: "Latin" },
  { code: "lb", name: "Luxembourgish" },
  { code: "mk", name: "Macedonian" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay" },
  { code: "ml", name: "Malayalam" },
  { code: "mt", name: "Maltese" },
  { code: "mi", name: "Maori" },
  { code: "mr", name: "Marathi" },
  { code: "mn", name: "Mongolian" },
  { code: "my", name: "Myanmar" },
  { code: "ne", name: "Nepali" },
  { code: "ps", name: "Pashto" },
  { code: "fa", name: "Persian" },
  { code: "pa", name: "Punjabi" },
  { code: "sm", name: "Samoan" },
  { code: "gd", name: "Scots Gaelic" },
  { code: "st", name: "Sesotho" },
  { code: "sn", name: "Shona" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhala" },
  { code: "so", name: "Somali" },
  { code: "su", name: "Sundanese" },
  { code: "tg", name: "Tajik" },
  { code: "ta", name: "Tamil" },
  { code: "tt", name: "Tatar" },
  { code: "te", name: "Telugu" },
  { code: "tk", name: "Turkmen" },
  { code: "ur", name: "Urdu" },
  { code: "ug", name: "Uyghur" },
  { code: "uz", name: "Uzbek" },
  { code: "cy", name: "Welsh" },
  { code: "xh", name: "Xhosa" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
]

const API_KEY = "f26ca4c32993ad45544b"

export default function TransolaApp() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("ar")
  const [isLoading, setIsLoading] = useState(false)
  const [translations, setTranslations] = useState<Translation[]>([])
  const [favorites, setFavorites] = useState<Translation[]>([])
  const [activeTab, setActiveTab] = useState("translate")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clearHistoryDialog, setClearHistoryDialog] = useState(false)
  const [clearFavoritesDialog, setClearFavoritesDialog] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const savedTranslations = localStorage.getItem("transola-history")
    const savedFavorites = localStorage.getItem("transola-favorites")

    if (savedTranslations) {
      setTranslations(JSON.parse(savedTranslations))
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("transola-history", JSON.stringify(translations))
  }, [translations])

  useEffect(() => {
    localStorage.setItem("transola-favorites", JSON.stringify(favorites))
  }, [favorites])

  const translateText = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setTranslatedText("")
        return
      }

      setIsLoading(true)

      try {
        const langPair = `${sourceLang}|${targetLang}`
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}&key=${API_KEY}`,
        )

        const data = await response.json()

        if (data.responseStatus === 200) {
          const translated = data.responseData.translatedText
          setTranslatedText(translated)

          const newTranslation: Translation = {
            id: Date.now().toString(),
            sourceText: text,
            translatedText: translated,
            sourceLang,
            targetLang,
            timestamp: Date.now(),
          }

          setTranslations((prev) => [newTranslation, ...prev.slice(0, 49)])
        } else {
          throw new Error(data.responseDetails || "Translation failed")
        }
      } catch (error) {
        toast({
          title: "Translation Error",
          description: error instanceof Error ? error.message : "Failed to translate text",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [sourceLang, targetLang, toast],
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sourceText.trim()) {
        translateText(sourceText)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [sourceText, translateText])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      })
    }
  }

  const toggleFavorite = (translation: Translation) => {
    const isFavorite = favorites.some((fav) => fav.id === translation.id)

    if (isFavorite) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== translation.id))
      toast({
        title: "Removed from Favorites",
        description: "Translation removed from favorites",
      })
    } else {
      setFavorites((prev) => [translation, ...prev])
      toast({
        title: "Added to Favorites",
        description: "Translation saved to favorites",
      })
    }
  }

  const exportAsJSON = () => {
    const data = {
      translations,
      favorites,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transola-translations.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Translations exported as JSON",
    })
  }

  const exportAsTXT = () => {
    const content = translations
      .map(
        (t) =>
          `${new Date(t.timestamp).toLocaleString()}\n${t.sourceLang} → ${t.targetLang}\n"${t.sourceText}" → "${t.translatedText}"\n\n`,
      )
      .join("")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transola-translations.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Translations exported as TXT",
    })
  }

  const clearHistory = () => {
    setTranslations([])
    setClearHistoryDialog(false)
    toast({
      title: "History Cleared",
      description: "All translation history has been cleared",
    })
  }

  const clearFavorites = () => {
    setFavorites([])
    setClearFavoritesDialog(false)
    toast({
      title: "Favorites Cleared",
      description: "All favorites have been cleared",
    })
  }

  const swapLanguages = () => {
    const tempLang = sourceLang
    setSourceLang(targetLang)
    setTargetLang(tempLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code
  }

  const TranslationCard = ({
    translation,
    showFavoriteButton = true,
  }: { translation: Translation; showFavoriteButton?: boolean }) => {
    const isFavorite = favorites.some((fav) => fav.id === translation.id)

    return (
      <Card className="mb-3 transition-all duration-300 hover:shadow-md border-slate-200 bg-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
              {getLanguageName(translation.sourceLang)} → {getLanguageName(translation.targetLang)}
            </Badge>
            <div className="flex gap-1">
              {showFavoriteButton && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleFavorite(translation)}
                  className="h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? <StarOff className="h-4 w-4 text-yellow-500" /> : <Star className="h-4 w-4" />}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(translation.translatedText)}
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                aria-label="Copy translation"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">{translation.sourceText}</p>
            <p className="text-sm font-medium text-slate-900">{translation.translatedText}</p>
            <p className="text-xs text-slate-400">{new Date(translation.timestamp).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center ms-5">
            <Languages className="h-7 w-7 mr-3 text-blue-600" />
            <span className="font-bold text-2xl text-slate-800">Transola</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Button
              variant={activeTab === "translate" ? "default" : "ghost"}
              onClick={() => setActiveTab("translate")}
              className={
                activeTab === "translate" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50 hover:text-blue-600"
              }
            >
              Translate
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => setActiveTab("history")}
              className={
                activeTab === "history" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50 hover:text-blue-600"
              }
            >
              History ({translations.length})
            </Button>
            <Button
              variant={activeTab === "favorites" ? "default" : "ghost"}
              onClick={() => setActiveTab("favorites")}
              className={
                activeTab === "favorites" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50 hover:text-blue-600"
              }
            >
              Favorites ({favorites.length})
            </Button>
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[300px] bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-2 p-4">
              <Button
                variant={activeTab === "translate" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("translate")
                  setMobileMenuOpen(false)
                }}
                className={`justify-start ${activeTab === "translate" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}
              >
                Translate
              </Button>
              <Button
                variant={activeTab === "history" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("history")
                  setMobileMenuOpen(false)
                }}
                className={`justify-start ${activeTab === "history" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}
              >
                History ({translations.length})
              </Button>
              <Button
                variant={activeTab === "favorites" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("favorites")
                  setMobileMenuOpen(false)
                }}
                className={`justify-start ${activeTab === "favorites" ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}
              >
                Favorites ({favorites.length})
              </Button>
            </nav>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {activeTab === "translate" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-800">Professional Translation Platform</h1>
              <p className="text-slate-600 text-lg">Translate between over 200 languages instantly</p>
            </div>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Languages className="h-6 w-6" />
                  Translation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">From</label>
                    <Select value={sourceLang} onValueChange={setSourceLang}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white" side="bottom" align="start">
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={swapLanguages}
                      className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 bg-transparent"
                      aria-label="Swap languages"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">To</label>
                    <Select value={targetLang} onValueChange={setTargetLang}>
                      <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white" side="bottom" align="start">
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Source Text</label>
                    <Textarea
                      placeholder="Enter text to translate..."
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      className="min-h-[150px] resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      aria-label="Source text input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Translation</label>
                    <div className="relative">
                      <Textarea
                        value={translatedText}
                        readOnly
                        className="min-h-[150px] resize-none bg-slate-50 border-slate-300"
                        placeholder="Translation will appear here..."
                        aria-label="Translation output"
                        aria-live="polite"
                      />
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        </div>
                      )}
                      {translatedText && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(translatedText)}
                          className="absolute top-0 right-[-32px] hover:bg-inherit hover:text-blue-600"
                          aria-label="Copy translation"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {translatedText && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(translatedText)}
                      className="border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Translation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "history" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Translation History</h2>
                <p className="text-slate-600">
                  {translations.length} translation{translations.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={exportAsJSON}
                  className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={exportAsTXT}
                  className="border-blue-300 hover:bg-blue-50 hover:border-blue-400 bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export TXT
                </Button>
                {translations.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={() => setClearHistoryDialog(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Clear History
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {translations.length === 0 ? (
                <Card className="shadow-lg border-0 bg-white">
                  <CardContent className="p-12 text-center">
                    <History className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">No translations yet</h3>
                    <p className="text-slate-600">Start translating to see your history here</p>
                  </CardContent>
                </Card>
              ) : (
                translations.map((translation) => <TranslationCard key={translation.id} translation={translation} />)
              )}
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Favorite Translations</h2>
                <p className="text-slate-600">
                  {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
                </p>
              </div>
              {favorites.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setClearFavoritesDialog(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Clear Favorites
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {favorites.length === 0 ? (
                <Card className="shadow-lg border-0 bg-white">
                  <CardContent className="p-12 text-center">
                    <Star className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">No favorites yet</h3>
                    <p className="text-slate-600">Star translations to save them as favorites</p>
                  </CardContent>
                </Card>
              ) : (
                favorites.map((translation) => (
                  <TranslationCard key={translation.id} translation={translation} showFavoriteButton={false} />
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <Dialog open={clearHistoryDialog} onOpenChange={setClearHistoryDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Clear Translation History</DialogTitle>
            <DialogDescription className="text-slate-600">
              Are you sure you want to clear all translation history? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearHistoryDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearHistory} className="bg-red-600 hover:bg-red-700">
              Clear History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={clearFavoritesDialog} onOpenChange={setClearFavoritesDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Clear Favorites</DialogTitle>
            <DialogDescription className="text-slate-600">
              Are you sure you want to clear all favorites? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearFavoritesDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearFavorites} className="bg-red-600 hover:bg-red-700">
              Clear Favorites
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
