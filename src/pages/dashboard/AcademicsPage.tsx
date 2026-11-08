import React, { useState } from 'react';
import { GraduationCap, BookOpen, Calendar, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { workOs } from '../../services/workOsStorage';
import { soundFx } from '../../components/ui/AudioSynthesizer';
import { AcademicCourse, UserId } from '../../types/workOs';

export const AcademicsPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserId>('sreesh');
  const courses = workOs.getAcademicCourses(selectedUser);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-burgundy-soft">Module: Academic Architecture</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-content-muted">
              Semester 7 • Degree Progress
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-content-primary">
            Academic Schedule & College Attendance
          </h1>
          <p className="text-xs text-content-secondary">
            Undergraduate semester courses, assignment submissions, exam schedules, and institutional attendance
          </p>
        </div>

        {/* User Switcher */}
        <div className="flex items-center gap-2">
          {(['sreesh', 'mrithula'] as const).map((id) => (
            <button
              key={id}
              onClick={() => {
                soundFx.playClick();
                setSelectedUser(id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedUser === id
                  ? 'bg-burgundy text-white shadow-sm'
                  : 'bg-surface-elevated text-content-secondary hover:text-content-primary'
              }`}
            >
              {id === 'sreesh' ? "Sreesh's Academics" : "Mrithula's Academics"}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimers & Integrity Notice */}
      <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle flex items-center justify-between text-xs text-content-muted">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Institutional Data Boundary: College attendance is kept strictly isolated from office/internship working hours.
          </span>
        </div>
        <span className="font-mono text-[11px] text-content-primary font-bold">Minimum Requirement: 75%</span>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-6 sm:p-8 rounded-3xl border border-border-subtle bg-surface-card space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-surface-elevated border border-border-subtle text-burgundy-soft">
                  {course.code} • {course.credits} Credits
                </span>
                <span className="text-[11px] font-mono text-content-muted">{course.semester}</span>
              </div>

              <div>
                <h3 className="font-display font-bold text-xl text-content-primary leading-snug">
                  {course.title}
                </h3>
              </div>

              {/* Attendance Progress Meter */}
              <div className="p-4 rounded-2xl bg-surface-elevated/40 border border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-content-muted">Classroom Attendance</span>
                  <span className={`font-bold ${
                    course.attendanceStats.percentage >= 85
                      ? 'text-emerald-400'
                      : course.attendanceStats.percentage >= 75
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}>
                    {course.attendanceStats.percentage}% ({course.attendanceStats.attendedClasses}/{course.attendanceStats.totalClasses})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-card overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${course.attendanceStats.percentage}%` }}
                  />
                </div>
              </div>

              {/* Pending Assignments */}
              {course.assignments.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-[10px] font-mono uppercase text-content-muted tracking-wider">
                    Assignments & Coursework
                  </h4>
                  <div className="space-y-1.5">
                    {course.assignments.map((asg) => (
                      <div
                        key={asg.id}
                        className="p-2.5 rounded-xl bg-surface-elevated/20 border border-border-subtle flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-medium text-content-primary">{asg.title}</p>
                          <span className="text-[10px] font-mono text-content-muted">Due: {asg.dueDate}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            asg.status === 'submitted'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {asg.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exams */}
              {course.exams.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <h4 className="text-[10px] font-mono uppercase text-content-muted tracking-wider">
                    Upcoming Examination
                  </h4>
                  <div className="p-3 rounded-xl bg-burgundy/10 border border-burgundy/30 flex items-center justify-between text-xs">
                    <span className="font-semibold text-content-primary">{course.exams[0].title}</span>
                    <span className="font-mono text-burgundy-soft font-bold">{course.exams[0].date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
