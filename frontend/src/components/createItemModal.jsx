import { useState } from "react";

function CreateItemModal({ isOpen, onClose, onCreate, users = [] }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [qty, setQty] = useState(1);
    const [userId, setUserId] = useState('');
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState(null);

    if(!isOpen) {
        return null;
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setSubmit(true);
        try {
            await onCreate({
                name,
                description,
                qty: Number(qty),
                user_id: userId ? Number(userId) : null,
            });

            setName('');
            setDescription('');
            setQty(1);
            setUserId('');
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
                            required
                            placeholder="Whatever you please...be professional Matt!"
                        />
                    </label>
                    <label>
                        Quantity
                        <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(event) => setQty(event.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Owner
                        {users.length > 0 ? (
                            <select
                                value={userId}
                                onChange={(event) => setUserId(event.target.value)}
                                required
                            >
                                <option value="">---Select owner---</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            
                        )}
                    </label>
                </form>
            </div>
        </div>
    );
};

export default CreateItemModal;