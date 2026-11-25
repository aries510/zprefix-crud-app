import { useState, useMemo } from "react";

function CreateItemModal({ isOpen, onClose, onCreate, users = [] }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [qty, setQty] = useState(1);
    const [ownerName, setOwnerName] = useState('');
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState(null);

    const matchedUser = useMemo(() => {
        const formatted = ownerName.trim().toLowerCase();
        if(!formatted) {
            return null
        };
        return users.find((user) => `${user.first_name} ${user.last_name}`.toLowerCase() === formatted) || null;
    }, [ownerName, users]);

    if(!isOpen) {
        return null;
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setSubmit(true);
        setError(null);
        try {
            let resolvedUserId = matchedUser?.id || null;

            if(ownerName.trim() && !matchedUser) {
                const parts = ownerName.trim().split(/\s+/);
                if(parts.length < 2){
                    throw new Error('User not found. Enter both a first and last name to create a user.');
                }

                const [first_name, ...rest] = parts;
                const last_name = rest.join(' ');

                const createdUser = await onCreateUser({ first_name, last_name });
                resolvedUserId = createdUser.id
            };

            await onCreate({
                name,
                description,
                qty: Number(qty),
                user_id: resolvedUserId,
            });

            setName('');
            setDescription('');
            setQty(1);
            setOwnerName('');
            onClose();
        } catch(error) {
            setError(error.message || 'Failed to create item');
        } finally {
            setSubmit(false)
        };
    };

    return (
        <div className="create-item-modal-backdrop" onClick={onClose}>
            <div className="create-item-modal" onClick={(event) => event.stopPropagation()}>
                <div className="create-item-modal-header">
                    <h2>Add New Item</h2>
                    <button type="button" onClick={onClose}>Close</button>
                </div>

                {error && (
                    <div className="create-item-modal-error">
                        {error}
                    </div>
                )}

                <form onSubmit={submitForm}>
                    <label>
                        Name
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            placeholder="Whatever you please..."
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={3}
                            required
                            placeholder="Whatever you please...be professional Matt!"
                        />
                    </label>
                    <label>
                        Quantity
                        <input
                            type="number"
                            min="0"
                            value={qty}
                            onChange={(event) => setQty(event.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Owner
                        <input
                            type="text"
                            list="users-datalist"
                            value={ownerName}
                            onChange={(event) => setOwnerName(event.target.value)}
                            placeholder="First and Last name..."
                            required
                        />
                        <datalist id="users-datalist">
                            {users.map((user) => (
                                <option key={user.id} value={`${user.first_name} ${user.last_name}`} />
                            ))}
                        </datalist>

                        {ownerName.trim() && (
                            <small>
                                {matchedUser
                                    ? `Existing user matched (ID# ${matchedUser.id})`
                                    : `"${ownerName.trim()}" isn't in the database - a new user will be created`}
                            </small>
                        )}
                    </label>
                    <div className="create-item-modal-bottom-btns">
                        <button type="button" onClick={onClose} disabled={submit}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submit}>
                            {submit ? 'Saving...' : 'Add Item' }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateItemModal;