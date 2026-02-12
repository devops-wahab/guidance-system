import { getAcademicHistory, getStudentProfile } from "@/lib/student-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function TranscriptPage() {
  const profile = await getStudentProfile();
  const history = await getAcademicHistory();

  return (
    <div className="space-y-6 container mx-auto py-8">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Academic Transcript</h1>
          <p className="text-muted-foreground mt-1">
            {profile.name} • {profile.matricNumber}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{profile.gpa?.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">Cumulative GPA</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            No academic history available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {history.map((record, index) => (
            <Card key={`${record.session}-${record.semester}-${index}`}>
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {record.session} Academic Session - {record.semester}{" "}
                    Semester
                  </CardTitle>
                  <Badge variant="outline" className="bg-background">
                    GPA: {record.gpa.toFixed(2)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Title</TableHead>
                      <TableHead className="text-right">Unit</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {record.courses.map((course) => (
                      <TableRow key={course.code}>
                        <TableCell className="font-medium">
                          {course.code}
                        </TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell className="text-right">
                          {course.unit}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {course.grade}
                        </TableCell>
                        <TableCell className="text-center">
                          {course.points}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/10 font-medium">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        {record.totalUnits}
                      </TableCell>
                      <TableCell
                        colSpan={2}
                        className="text-center"
                      ></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
