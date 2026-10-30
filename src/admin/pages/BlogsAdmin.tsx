import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  X,
  Sparkles,
} from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminBlogPost, ItemStatus } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { RichEditor } from '../components/RichEditor';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';

export const BlogsAdmin: React.FC = () => {
  const { items: blogs, create, update, remove, reorder } = useAdminCollection('blogs');
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ItemStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal form states
  const [editingBlog, setEditingBlog] = useState<AdminBlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPost | null>(null);

  // Form field states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('Web Design');
  const [tagsInput, setTagsInput] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('PrimeXPixel Team');
  const [publishDate, setPublishDate] = useState('Feb 18, 2026');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<ItemStatus>('published');
  const [readingTime, setReadingTime] = useState('5 min');
  const [area, setArea] = useState('Mumbai');

  // Categories present in blogs
  const categories = Array.from(new Set(blogs.map((b) => b.category))).filter(Boolean);

  const openCreateForm = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setCoverImage('/brand/blog/kurla-web-dev.jpg');
    setCategory('Web Design');
    setTagsInput('Web Development, Growth, SEO');
    setExcerpt('');
    setContent('');
    setAuthor('PrimeXPixel Team');
    setPublishDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setSeoTitle('');
    setSeoDescription('');
    setStatus('published');
    setReadingTime('5 min');
    setArea('Mumbai');
    setIsFormOpen(true);
  };

  const openEditForm = (blog: AdminBlogPost) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setCoverImage(blog.coverImage);
    setCategory(blog.category);
    setTagsInput((blog.tags || []).join(', '));
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setAuthor(blog.author || 'PrimeXPixel Team');
    setPublishDate(blog.publishDate);
    setSeoTitle(blog.seoTitle || blog.title);
    setSeoDescription(blog.seoDescription || blog.excerpt);
    setStatus(blog.status);
    setReadingTime(blog.readingTime || '5 min');
    setArea(blog.area || 'Mumbai');
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingBlog) {
      // Auto-generate slug
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      setSeoTitle(`${val} | PrimeXPixel`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a blog title', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const blogData: Partial<AdminBlogPost> = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      coverImage,
      category,
      tags,
      excerpt,
      content,
      author,
      publishDate,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      status,
      readingTime,
      area,
    };

    if (editingBlog) {
      update(editingBlog.id, blogData);
      showToast('Blog article updated successfully');
    } else {
      create(blogData);
      showToast('New blog article published successfully');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast(`Deleted "${deleteTarget.title}"`);
      setDeleteTarget(null);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Blogs Management
          </h2>
          <p className="mt-1 text-xs text-muted">
            Create, edit, reorder and publish articles with rich text and SEO controls
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Write New Blog</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-app-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by title, keywords or category..."
            className="w-full rounded-xl border border-[var(--border)] bg-app py-2 pl-9 pr-4 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-2.5 py-1.5 text-xs text-muted">
            <Filter className="h-3.5 w-3.5 text-dim" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-app focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-2.5 py-1.5 text-xs text-muted">
              <Tag className="h-3.5 w-3.5 text-dim" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-app focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="text-[11px] font-semibold text-dim px-2">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
          </div>
        </div>
      </div>

      {/* Sortable Blog List */}
      {filteredBlogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No blog articles found.</p>
          <p className="text-xs text-dim mt-1">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <SortableList
          items={filteredBlogs}
          onReorder={(ids) => {
            reorder(ids);
            showToast('Blog order saved successfully');
          }}
          renderItem={(blog) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-app border border-[var(--border)]">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                      }}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] text-dim">
                      No cover
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        blog.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {blog.status === 'published' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {blog.status}
                    </span>
                    <span className="rounded-full bg-app px-2 py-0.5 text-[10px] font-medium text-dim border border-[var(--border)]">
                      {blog.category}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-semibold text-app mt-1 line-clamp-1">
                    {blog.title}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-dim mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {blog.publishDate}
                    </span>
                    <span>•</span>
                    <span>By {blog.author}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => openEditForm(blog)}
                  className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(blog)}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit Blog Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-4xl rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <div>
                <h3 className="font-display text-lg font-bold text-app">
                  {editingBlog ? 'Edit Blog Article' : 'Write New Blog Article'}
                </h3>
                <p className="text-xs text-muted">
                  Fill in all article content, cover image, and SEO metadata
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-dim hover:text-app rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Website Development in Kurla: What Local Businesses Get Wrong"
                      className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 text-sm text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="website-development-company-kurla"
                      className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 font-mono text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Web Design"
                        className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 text-sm text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Publication Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ItemStatus)}
                        className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 text-sm text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 text-sm text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Publish Date
                      </label>
                      <input
                        type="text"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        placeholder="Feb 18, 2026"
                        className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 text-sm text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Keywords / Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Web Design, Mumbai, SEO, Conversion"
                      className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 text-sm text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Right: Cover Image Upload */}
                <div>
                  <ImageUploader
                    label="Cover Image (Auto-Compressed to WebP)"
                    value={coverImage}
                    onChange={setCoverImage}
                    folder="blogs"
                    helperText="Upload JPG/PNG/WebP. Ideal ratio 16:9."
                  />

                  <div className="mt-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Excerpt / Summary
                    </label>
                    <textarea
                      rows={3}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Short 2-sentence teaser for blog listing cards..."
                      className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-app p-3 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rich Content Editor */}
              <div className="pt-2">
                <RichEditor
                  label="Article Content (Rich Editor with Headings & Formatting)"
                  value={content}
                  onChange={setContent}
                />
              </div>

              {/* SEO Section */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--color-brand-blue)]">
                  <Sparkles className="h-4 w-4" />
                  <span>Search Engine Optimization (SEO)</span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-dim">Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Page Title for Google search results..."
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-dim">Meta Description</label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Brief description that appears in Google search snippets..."
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app-2 p-2.5 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-medium text-muted hover:text-app hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl gradient-brand px-5 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
                >
                  {editingBlog ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Blog Article?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Article"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
