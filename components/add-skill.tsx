"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddSkill() {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<{ name: string; id: string }[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/users/skills", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response);
          throw new Error("Failed to fetch skills!");
        }

        const data = await response.json();
        setSkills(
          data.map((skill: any) => ({
            name: skill.skill.name,
            id: skill.skill_id,
          }))
        );
      } catch (error) {
        console.log(error);
        setError("Failed to fetch skills!");
      }
    };

    fetchSkills();
  }, []);

  const handleAddSkill = async () => {
    setError("");
    setSuccess("");
    if (skill.trim() === "") {
      setError("Skill cannot be empty");
      return;
    }

    if (skills.some((s) => s.name === skill.trim())) {
      setError("This skill has already been added");
      return;
    }

    try {
      const response = await fetch("/api/users/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skill_id: skill.trim() }),
      });

      if (response.ok) {
        setSuccess("Skill added successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setSkills([...skills, { name: skill.trim(), id: "" }]);
        setSkill("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to add skill");
    }
  };

  const handleRemoveSkill = async (skillToRemove: {
    name: string;
    id: string;
  }) => {
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/users/skills", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skill_id: skillToRemove.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete skill!");
      }

      setSuccess("Skill removed successfully!");
      setSkills(skills.filter((s) => s.name !== skillToRemove.name));
    } catch (error) {
      console.log(error);
      setError("Failed to remove skill");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Add Your Skills
        </h2>
        <p className="text-gray-600">Add skills that showcase your expertise</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a skill (e.g., React, Python)"
              className="w-full"
            />
          </div>
          <Button
            onClick={handleAddSkill}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            Add
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-emerald-600 text-sm">{success}</p>}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-700">Your Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full"
            >
              <span>{skill.name}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-emerald-900"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
