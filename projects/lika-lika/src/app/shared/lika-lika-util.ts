import {SubjectArea} from "../subject-area/api/subject-area";

export function getSubjectAreaDataName(subjectArea: SubjectArea): string {
  return subjectArea.replace(/\s/g, "-").toLowerCase();
}
