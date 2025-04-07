import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserDetails } from "@/utils/types/Users";
import EditUserForm from "../../forms/admin/users/edit-user-form";


interface EditUserDialogProps {
  user: UserDetails | null;
  open: boolean;
  onClose: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:w-[800px] lg:w-[1200px] ">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <EditUserForm user={user}/>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog;
