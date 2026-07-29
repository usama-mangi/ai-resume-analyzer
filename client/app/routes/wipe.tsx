import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSession } from "~/lib/auth-store";
import { api } from "~/lib/api";
import type { Resume } from "types";

const WipeApp = () => {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [deleting, setDeleting] = useState(false);

  const loadResumes = async () => {
    try {
      const data = await api.resumes.list();
      setResumes(data || []);
    } catch (err) {
      console.error("Failed to load resumes:", err);
    }
  };

  useEffect(() => {
    if (!isPending && !isAuthenticated) navigate("/login");
  }, [isPending, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) loadResumes();
  }, [isAuthenticated]);

  const handleDelete = async () => {
    setDeleting(true);
    for (const resume of resumes) {
      try {
        await api.resumes.delete(resume.id);
      } catch (err) {
        console.error(`Failed to delete resume ${resume.id}:`, err);
      }
    }
    setDeleting(false);
    loadResumes();
  };

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Wipe App Data</h1>
      <p className="mb-4">Authenticated as: {session?.user?.name || session?.user?.email}</p>
      <div className="mb-4">
        <p className="font-semibold">Existing resumes ({resumes.length}):</p>
        <div className="flex flex-col gap-2 mt-2">
          {resumes.map((r) => (
            <div key={r.id} className="flex flex-row gap-4 text-sm">
              <span className="text-gray-500">{r.id.substring(0, 8)}...</span>
              <span>{r.fileName}</span>
              <span className="text-gray-400">{r.jobTitle}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer disabled:opacity-50"
        onClick={handleDelete}
        disabled={deleting || resumes.length === 0}
      >
        {deleting ? "Deleting..." : "Wipe All Resumes"}
      </button>
    </div>
  );
};

export default WipeApp;