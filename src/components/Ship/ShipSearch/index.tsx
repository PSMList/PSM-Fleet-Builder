import { onlyDisplay } from "@/App";
import IconButton from "@/components/commons/IconButton";
import Search, { SearchItemType } from "@/components/commons/Search";
import { ShipItemsContext } from "@/components/Ship";
import ShipItem from "@/components/Ship/ShipItem";
import { ShipType } from "@/data/ship";
import { useStore } from "@/data/store";
import { createEffect, createSignal, useContext } from "solid-js";
import './ShipSearch.css';

const ShipSearch = () => {
    if (onlyDisplay) return <></>;
    
    const shipItemsContext = useContext(ShipItemsContext);

    const { database } = useStore().databaseService;
    
    const selectItem = (ship: ShipType) => {
        shipItemsContext.add( ship );
    }

    const [elements, setElements] = createSignal([] as SearchItemType[]);
    createEffect(() => {
        const ships = Array.from(database.ships.values());
        setElements(() =>
            ships.map( (ship: ShipType) => ({
                item: ship,
                search_field: ship.fullname,
                element:
                    <ShipItem
                        data={ ship }
                        actions={
                            <IconButton
                                iconID="plus-square"
                                onClick={ () => selectItem( ship ) }
                                title="Add ship"
                            />
                        }
                    />
            }) as SearchItemType)
        );
    });

    return (
        <Search
            placeholder="Search by ship name or ID"
            items={elements()}
        />
    );
}

export default ShipSearch;