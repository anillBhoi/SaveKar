"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { EnhancedWebsiteCard } from "@/components/enhanced-website-card";
import { EnhancedAddWebsiteDialog } from "@/components/enhanced-add-website-dialog";
import { FolderTree } from "@/components/folder-tree";
import { FolderBreadcrumb } from "@/components/folder-breadcrumb";
import { CreateFolderDialog } from "@/components/create-folder-dialog";
import { EditFolderDialog } from "@/components/edit-folder-dialog";
import { MobileFolderOverlay } from "@/components/mobile-folder-overlay";
import { LoadingScreen } from "@/components/loading-screen";
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Heart,
  TrendingUp,
  Clock,
  Sparkles,
  Loader2,
  FolderPlus,
  Sidebar,
  Folder,
  FileText,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

interface Website {
  _id: string;
  type: "youtube" | "twitter" | "instagram" | "website" | "note";
  url?: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  isFavorite: boolean;
  viewCount: number;
  embedId?: string;
  createdAt: string;
  folderId?: string;
}

interface FolderNode {
  _id: string;
  name: string;
  parentId?: string;
  color: string;
  icon: string;
  path: string;
  level: number;
  isExpanded: boolean;
  websiteCount: number;
  children: FolderNode[];
}

type SortOption = "newest" | "oldest" | "title" | "type" | "views";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [displayedWebsites, setDisplayedWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFolderOpen, setMobileFolderOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [createFolderParentId, setCreateFolderParentId] = useState<string>();
  const [editFolderOpen, setEditFolderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderNode | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const ITEMS_PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWebsites = async () => {
    try {
      const params = new URLSearchParams();
      if (filterType !== "all") params.append("type", filterType);
      if (searchTerm) params.append("search", searchTerm);
      if (showFavoritesOnly) params.append("favorites", "true");
      if (currentFolderId) {
        params.append("folderId", currentFolderId);
      } else {
        params.append("folderId", "null");
      }

      const response = await fetch(`/api/websites?${params}`);
      if (response.ok) {
        const data = await response.json();

        // Sort
        const sortedData = [...data].sort((a, b) => {
          switch (sortBy) {
            case "newest":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "oldest":
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            case "title":
              return a.title.localeCompare(b.title);
            case "type":
              return a.type.localeCompare(b.type);
            case "views":
              return (b.viewCount || 0) - (a.viewCount || 0);
            default:
              return 0;
          }
        });

        setWebsites(sortedData);

        if (sortedData.length > ITEMS_PER_PAGE) {
          setDisplayedWebsites(sortedData.slice(0, ITEMS_PER_PAGE));
          setCurrentPage(1);
        } else {
          setDisplayedWebsites(sortedData);
        }
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  };

  const loadMoreWebsites = () => {
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newWebsites = websites.slice(startIndex, endIndex);

    setTimeout(() => {
      setDisplayedWebsites((prev) => [...prev, ...newWebsites]);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 500);
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/landing");
      return;
    }
    const initializeData = async () => {
      await fetchWebsites();
      setIsLoading(false);
    };
    initializeData();
  }, [session, status, router]);

  useEffect(() => {
    if (!isLoading) fetchWebsites();
  }, [searchTerm, filterType, sortBy, showFavoritesOnly, currentFolderId]);

  if (status === "loading" || isLoading) return <LoadingScreen />;
  if (!session) return null;

  const stats = {
    total: websites.length,
    favorites: websites.filter((w) => w.isFavorite).length,
    youtube: websites.filter((w) => w.type === "youtube").length,
    twitter: websites.filter((w) => w.type === "twitter").length,
    instagram: websites.filter((w) => w.type === "instagram").length,
    websites: websites.filter((w) => w.type === "website").length,
    notes: websites.filter((w) => w.type === "note").length,
  };

  const hasMoreWebsites = websites.length > displayedWebsites.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={session.user} />
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`hidden md:block ${
            sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 overflow-hidden`}
        >
          <div className="min-h-screen bg-muted/40 border-r border-border p-3 overflow-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-primary">Folders</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCreateFolderOpen(true)}
                  className="h-7 w-7 text-primary hover:bg-accent"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>
              <FolderTree
                currentFolderId={currentFolderId}
                onFolderSelect={(id, name) => {
                  setCurrentFolderId(id);
                  setCurrentFolderName(name);
                }}
                onCreateFolder={() => setCreateFolderOpen(true)}
                onEditFolder={(f) => {
                  setEditingFolder(f);
                  setEditFolderOpen(true);
                }}
                onDeleteFolder={() => {
                  setRefreshTrigger((p) => p + 1);
                  fetchWebsites();
                }}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1">
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header - Fixed layout */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="h-10 w-10 text-primary"
                    >
                      <Sidebar className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="h-10 w-10 text-primary"
                    >
                      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent md:hidden">
                    {currentFolderName}
                  </h1>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <FolderBreadcrumb
                    currentFolderId={currentFolderId}
                    onNavigate={(id, name) => {
                      setCurrentFolderId(id);
                      setCurrentFolderName(name);
                    }}
                  />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent hidden md:block text-center">
                  {currentFolderName}
                </h1>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
              {Object.entries({
                Total: stats.total,
                Favorites: stats.favorites,
                YouTube: stats.youtube,
                Twitter: stats.twitter,
                Instagram: stats.instagram,
                Websites: stats.websites,
                Notes: stats.notes,
              }).map(([label, value]) => (
                <Card
                  key={label}
                  className="bg-card border border-border shadow-md"
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {value}
                    </div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search + Filters */}
            <div className="mb-8 space-y-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg bg-card border border-border text-foreground rounded-2xl"
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-center">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[160px] bg-card border border-border text-foreground">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="website">Websites</SelectItem>
                    <SelectItem value="note">Notes</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as SortOption)}
                >
                  <SelectTrigger className="w-[160px] bg-card border border-border text-foreground">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className="flex items-center space-x-2 bg-card border border-border text-foreground"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      showFavoritesOnly ? "fill-current text-destructive" : ""
                    }`}
                  />
                  <span>Favorites</span>
                </Button>

                <EnhancedAddWebsiteDialog
                  onWebsiteAdded={fetchWebsites}
                  currentFolderId={currentFolderId}
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayedWebsites.map((website) => (
                <EnhancedWebsiteCard
                  key={website._id}
                  website={website}
                  currentFolderId={currentFolderId}
                  onToggleFavorite={() => {}}
                  onDelete={() => {}}
                  onWebsiteMoved={() => {}}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMoreWebsites && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={loadMoreWebsites}
                  disabled={loadingMore}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8 py-3"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    <>Load More</>
                  )}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        parentId={createFolderParentId}
        onFolderCreated={fetchWebsites}
      />
      <EditFolderDialog
        open={editFolderOpen}
        onOpenChange={setEditFolderOpen}
        folder={editingFolder}
        onFolderUpdated={fetchWebsites}
      />
      <Toaster />
    </div>
  );
}