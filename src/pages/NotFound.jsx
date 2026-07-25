import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty"


export default function NotFound() {
    return (
        <Empty className="min-h-[calc(100svh-133px)]">
            <div className="flex flex-col gap-5 items-center border border-dashed rounded p-5">
                <EmptyHeader>
                    <EmptyTitle>404 - No Encontrado</EmptyTitle>
                    <EmptyDescription>
                        La página que buscas no existe. Intenta buscar lo que necesitas
                        a continuación.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <EmptyDescription>
                        ¿Necesitas ayuda? <Link to="#">Contacta con soporte</Link>
                    </EmptyDescription>
                </EmptyContent>
                <Button asChild className="w-fit">
                    <Link to="/">Regresar al inicio</Link>
                </Button>
            </div>
        </Empty>
    )
}
