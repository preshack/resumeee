import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, X, User, Save, Check, Building, GraduationCap } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import type { WorkExperience, Education } from '../store/appStore';

function uid() { return crypto.randomUUID(); }

export function ProfileForm() {
  const { userProfile, setUserProfile } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [saved, setSaved] = useState(false);

  const update = (p: Partial<typeof userProfile>) => setUserProfile({ ...userProfile, ...p });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !userProfile.skills.includes(s)) update({ skills: [...userProfile.skills, s] });
    setSkillInput('');
  };

  const removeSkill = (s: string) => update({ skills: userProfile.skills.filter((x) => x !== s) });

  const addExp = () => {
    update({ experience: [...userProfile.experience, { id: uid(), company: '', role: '', startDate: '', endDate: '', bullets: ['', '', ''] }] });
  };

  const updateExp = (id: string, p: Partial<WorkExperience>) => {
    update({ experience: userProfile.experience.map((e) => e.id === id ? { ...e, ...p } : e) });
  };

  const removeExp = (id: string) => update({ experience: userProfile.experience.filter((e) => e.id !== id) });

  const updateBullet = (eid: string, idx: number, val: string) => {
    const exp = userProfile.experience.find((e) => e.id === eid);
    if (!exp) return;
    const bullets = [...exp.bullets] as [string, string, string];
    bullets[idx] = val;
    updateExp(eid, { bullets });
  };

  const addEdu = () => update({ education: [...userProfile.education, { id: uid(), school: '', degree: '', year: '' }] });
  const updateEdu = (id: string, p: Partial<Education>) => update({ education: userProfile.education.map((e) => e.id === id ? { ...e, ...p } : e) });
  const removeEdu = (id: string) => update({ education: userProfile.education.filter((e) => e.id !== id) });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const ic = 'input-clean text-[13px] py-2';

  return (
    <div className="space-y-3">
      <button onClick={() => setCollapsed((c) => !c)} className="flex items-center justify-between w-full group">
        <span className="flex items-center gap-2 section-label group-hover:text-[#555] transition-colors">
          <User size={12} className="text-[#999]" />
          Your Profile
        </span>
        {collapsed ? <ChevronDown size={14} className="text-[#ccc]" /> : <ChevronUp size={14} className="text-[#ccc]" />}
      </button>

      {!collapsed && (
        <div className="space-y-4 animate-in">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-2">
            <input id="profile-name" className={ic} placeholder="Full Name" value={userProfile.name} onChange={(e) => update({ name: e.target.value })} />
            <input id="profile-email" className={ic} placeholder="Email" value={userProfile.email} onChange={(e) => update({ email: e.target.value })} />
            <input id="profile-phone" className={ic} placeholder="Phone" value={userProfile.phone} onChange={(e) => update({ phone: e.target.value })} />
            <input id="profile-linkedin" className={ic} placeholder="LinkedIn URL" value={userProfile.linkedin} onChange={(e) => update({ linkedin: e.target.value })} />
            <input id="profile-github" className={`${ic} col-span-2`} placeholder="GitHub URL" value={userProfile.github} onChange={(e) => update({ github: e.target.value })} />
          </div>

          {/* Skills */}
          <div>
            <p className="section-label mb-2">Skills</p>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {userProfile.skills.map((s) => (
                <span key={s} className="group flex items-center gap-1 bg-[#f3f4f6] border border-[#e5e7eb] text-[#374151] text-[11px] px-2 py-1 rounded-md hover:border-[#d1d5db] transition-colors">
                  {s}
                  <button onClick={() => removeSkill(s)} className="opacity-40 group-hover:opacity-100 hover:text-red-500 transition-all"><X size={9} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input id="skill-input" className={`${ic} flex-1`} placeholder="Add skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
              <button onClick={addSkill} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e5e7eb] text-[#666] hover:bg-[#f9f9f9] hover:text-[#333] transition-all shrink-0">
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label flex items-center gap-1.5"><Building size={10} /> Experience</p>
              <button onClick={addExp} className="flex items-center gap-1 text-[11px] text-[#4f46e5] hover:underline"><Plus size={10} /> Add</button>
            </div>
            {userProfile.experience.map((exp, i) => (
              <div key={exp.id} className="card p-3 mb-2 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-[#aaa] font-medium">#{i + 1}</span>
                  <button onClick={() => removeExp(exp.id)} className="text-[#ccc] hover:text-red-500 transition-colors"><X size={12} /></button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input className={ic} placeholder="Company" value={exp.company} onChange={(e) => updateExp(exp.id, { company: e.target.value })} />
                  <input className={ic} placeholder="Role" value={exp.role} onChange={(e) => updateExp(exp.id, { role: e.target.value })} />
                  <input className={ic} placeholder="Start" value={exp.startDate} onChange={(e) => updateExp(exp.id, { startDate: e.target.value })} />
                  <input className={ic} placeholder="End" value={exp.endDate} onChange={(e) => updateExp(exp.id, { endDate: e.target.value })} />
                </div>
                {exp.bullets.map((b, bi) => (
                  <input key={bi} className={`${ic} mb-1.5`} placeholder={`Achievement ${bi + 1}`} value={b} onChange={(e) => updateBullet(exp.id, bi, e.target.value)} />
                ))}
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label flex items-center gap-1.5"><GraduationCap size={10} /> Education</p>
              <button onClick={addEdu} className="flex items-center gap-1 text-[11px] text-[#4f46e5] hover:underline"><Plus size={10} /> Add</button>
            </div>
            {userProfile.education.map((edu) => (
              <div key={edu.id} className="flex gap-2 mb-2 items-center">
                <input className={ic} placeholder="School" value={edu.school} onChange={(e) => updateEdu(edu.id, { school: e.target.value })} />
                <input className={ic} placeholder="Degree" value={edu.degree} onChange={(e) => updateEdu(edu.id, { degree: e.target.value })} />
                <input className="w-20 input-clean text-[13px] py-2" placeholder="Year" value={edu.year} onChange={(e) => updateEdu(edu.id, { year: e.target.value })} />
                <button onClick={() => removeEdu(edu.id)} className="text-[#ccc] hover:text-red-500 transition-colors shrink-0"><X size={12} /></button>
              </div>
            ))}
          </div>

          {/* Save */}
          <button onClick={handleSave} className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium transition-all ${saved ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-[#fafafa] border border-[#e5e7eb] text-[#666] hover:bg-[#f0f0f0]'}`}>
            {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Profile</>}
          </button>
        </div>
      )}
    </div>
  );
}
