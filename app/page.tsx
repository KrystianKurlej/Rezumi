import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  return (
    <div className="h-screen grid grid-cols-6">
      <div className="h-full">
        <div className="h-full p-6 overflow-y-auto">
          Templates
        </div>
      </div>
      <div className="col-span-3 h-full">
        <div className="bg-gray-50 h-full p-6 border-x overflow-y-auto">
          <div className="p-2 bg-white shadow-sm">
            CV Preview
          </div>
        </div>
      </div>
      <div className="col-span-2 h-full">
        <div className="h-full p-6 overflow-y-auto">
          <form>
            Form
          </form>
        </div>
      </div>
    </div>
  );
}
