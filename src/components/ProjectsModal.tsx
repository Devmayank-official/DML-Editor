'use client';

import { useEditorStore } from '@/editor/editorStore';
import { X, Plus, Folder, Clock, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/core/types';
import { toast } from 'sonner';

function ProjectRow({ project, isCurrent, onLoad, onDelete }: {
  project: Project;
  isCurrent: boolean;
  onLoad: () => void;
  onDelete: () => void;
}) {
  const updatedAt = new Date(project.updatedAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors group border-b border-[#1a1d24]',
        isCurrent ? 'bg-[#252a36]' : 'hover:bg-[#1a1d24]'
      )}
      onClick={onLoad}
    >
      <Folder className={cn('w-4 h-4 shrink-0', isCurrent ? 'text-[#6366f1]' : 'text-[#555874]')} />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isCurrent ? 'text-[#e2e4ed]' : 'text-[#8b8fa8] group-hover:text-[#e2e4ed]')}>
          {project.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock className="w-2.5 h-2.5 text-[#3a3f52]" />
          <span className="text-[10px] text-[#3a3f52] font-mono">{updatedAt}</span>
          {project.useTailwind && (
            <span className="text-[10px] px-1 bg-cyan-500/10 text-cyan-400 rounded">TW</span>
          )}
        </div>
      </div>
      {!isCurrent && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-[#555874] hover:text-red-400 transition-all"
          title="Delete project"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      )}
      {isCurrent && (
        <span className="text-[10px] px-1.5 py-0.5 bg-[#6366f1]/20 text-[#6366f1] rounded font-medium">
          Active
        </span>
      )}
    </div>
  );
}

export default function ProjectsModal() {
  const isOpen = useEditorStore((s) => s.projectsOpen);
  const setProjectsOpen = useEditorStore((s) => s.setProjectsOpen);
  const projects = useEditorStore((s) => s.projects);
  const currentProject = useEditorStore((s) => s.currentProject);
  const loadProject = useEditorStore((s) => s.loadProject);
  const createNewProject = useEditorStore((s) => s.createNewProject);

  if (!isOpen) return null;

  const handleDelete = async (project: Project) => {
    if (project.id === currentProject?.id) return;
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    const { deleteProject } = await import('@/storage/db');
    await deleteProject(project.id);
    const { loadAllProjects } = useEditorStore.getState();
    await loadAllProjects();
    toast.success('Project deleted');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) setProjectsOpen(false); }}
    >
      <div className="w-full max-w-md bg-[#13151a] border border-[#2a2d3a] rounded-xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2d3a]">
          <h2 className="text-base font-semibold text-[#e2e4ed]">Projects</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await createNewProject();
                setProjectsOpen(false);
                toast.success('New project created');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366f1] hover:bg-[#818cf8] text-white text-xs rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
            <button
              onClick={() => setProjectsOpen(false)}
              className="p-1 rounded hover:bg-[#1a1d24] text-[#555874] hover:text-[#8b8fa8] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project list */}
        <div className="max-h-[60vh] overflow-y-auto">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Folder className="w-8 h-8 text-[#2a2d3a]" />
              <p className="text-sm text-[#555874]">No projects yet</p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                isCurrent={project.id === currentProject?.id}
                onLoad={() => {
                  loadProject(project);
                  setProjectsOpen(false);
                }}
                onDelete={() => handleDelete(project)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
