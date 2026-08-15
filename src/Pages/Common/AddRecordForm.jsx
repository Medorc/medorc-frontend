
import { useNavigate } from "react-router-dom";
import { Input, Textarea } from "../../Components/ui/Field";
import { Button } from "../../Components/ui/Button";
import { Card } from "../../Components/ui/Card";

function AddRecordForm({ data, handleChange, onNext }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <h2 className="mb-8 pb-2 text-center font-display text-xl font-semibold tracking-wide text-foreground">
        Record Details
      </h2>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              type="text"
              label="Diagnosis name"
              value={data.diagnosis_name}
              onChange={(e) => handleChange("basicDetails", "diagnosis_name", e.target.value)}
            />

            <Input
              type="text"
              label="Doctor name"
              value={data.doctor_name}
              onChange={(e) => handleChange("basicDetails", "doctor_name", e.target.value)}
            />

            <div className="md:col-span-2">
              <Textarea
                label="History of present illness"
                rows={3}
                value={data.history_of_present_illness}
                onChange={(e) =>
                  handleChange("basicDetails", "history_of_present_illness", e.target.value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Treatment undergone"
                rows={3}
                value={data.treatment_undergone}
                onChange={(e) =>
                  handleChange("basicDetails", "treatment_undergone", e.target.value)
                }
              />
            </div>

            <Input
              type="text"
              label="Hospital name"
              value={data.hospital_name}
              onChange={(e) => handleChange("basicDetails", "hospital_name", e.target.value)}
            />

            <Input
              type="date"
              label="Appointment date"
              value={data.appointment_date}
              onChange={(e) => handleChange("basicDetails", "appointment_date", e.target.value)}
            />

            <Input
              type="text"
              label="Reg. No"
              value={data.reg_no || ""}
              onChange={(e) => handleChange("basicDetails", "reg_no", e.target.value)}
            />

            <div className="md:col-span-2">
              <Textarea
                label="Alternative system of medicine"
                rows={2}
                value={data.alternative_medicine || ""}
                onChange={(e) =>
                  handleChange("basicDetails", "alternative_medicine", e.target.value)
                }
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse justify-end gap-4 pt-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddRecordForm;
