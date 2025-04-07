import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { UserDetails } from "@/utils/types/Users";


interface ViewUserDialogProps {
  user: UserDetails | null;
  open: boolean;
  onClose: () => void;
}

const ViewUserDialog: React.FC<ViewUserDialogProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  return (
    <Dialog 
    open={open} onOpenChange={onClose}>
      <DialogContent className="md:w-[800px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <Separator/>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div>
          <p className="font-semibold">Name</p>
          <p>{user.fullname}</p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="font-semibold">Phone</p>
          <p> {user.phone}</p>
        </div>        
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewUserDialog;
